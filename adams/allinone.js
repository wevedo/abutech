
const { adams } = require('../Ibrahim/adams');
const traduire = require("../Ibrahim/traduction") ;
const { default: axios } = require('axios');
const pkg = require('@whiskeysockets/baileys');
const { generateWAMessageFromContent, proto } = pkg;



adams({ nomCom: "gpt3", reaction: "🪅", categorie: "ai" }, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  try {
    if (!arg || arg.length === 0) {
      return repondre('Hello 🖐️.\n\n What help can I offer you today?');
    }

    // Combine arguments into a single string
    const prompt = arg.join(' ');
    const response = await fetch(`https://api.gurusensei.workers.dev/llama?prompt=${prompt}`);
    const data = await response.json();

    if (data && data.response && data.response.response) {
      const answer = data.response.response;

      // Check if the answer contains code
      const codeMatch = answer.match(/```([\s\S]*?)```/);

      const msg = generateWAMessageFromContent(dest, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: answer
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "> *BWM XMD*"
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: "",
                subtitle: "",
                hasMediaAttachment: false
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [] // No buttons
              })
            })
          }
        }
      }, {});

      await zk.relayMessage(dest, msg.message, {
        messageId: msg.key.id
      });
    } else {
      throw new Error('Invalid response from the API.');
    }
  } catch (error) {
    console.error('Error getting response:', error.message);
    repondre('Error getting response.');
  }
});


adams({ nomCom: "gpt2", reaction: "🪅", categorie: "ai" }, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  try {
    if (!arg || arg.length === 0) {
      return repondre('Hello 🖐️.\n\n What help can I offer you today?');
    }

    // Combine arguments into a single string
    const prompt = arg.join(' ');
    const response = await fetch(`https://api.gurusensei.workers.dev/llama?prompt=${prompt}`);
    const data = await response.json();

    if (data && data.response && data.response.response) {
      const answer = data.response.response;

      // Check if the answer contains code
      const codeMatch = answer.match(/```([\s\S]*?)```/);

      const msg = generateWAMessageFromContent(dest, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: answer
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "> *BWM XMD*"
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: "",
                subtitle: "",
                hasMediaAttachment: false
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [] // No buttons
              })
            })
          }
        }
      }, {});

      await zk.relayMessage(dest, msg.message, {
        messageId: msg.key.id
      });
    } else {
      throw new Error('Invalid response from the API.');
    }
  } catch (error) {
    console.error('Error getting response:', error.message);
    repondre('Error getting response.');
  }
});
adams({
  nomCom: "phone",
  aliases: ["checknum", "validate", "numinfo", "valid"], // Adding aliases
  reaction: "📞",
  categorie: "General"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  try {
    if (!arg || arg.length === 0) {
      return repondre(`Please enter a phone number to validate.`);
    }

    const num = arg.join(' ');
    const response = await fetch(`https://tajammalmods.xyz/Validater.php?num=${num}`);
    const data = await response.json();

    if (data.valid) {
      const carrier = data.carrier;
      const country = data.country;
      const intlFormat = data.international_format;
      const nationalFormat = data.national_format;
      const lineType = data.line_type === 1 ? "Mobile" : "Landline";
      const location = data.location;
      const timeZone = data.time_zones[0];

      await repondre(`Phone Number Validation:\n\n*Carrier:* ${carrier}\n*Country:* ${country}\n*International Format:* ${intlFormat}\n*National Format:* ${nationalFormat}\n*Line Type:* ${lineType}\n*Location:* ${location}\n*Time Zone:* ${timeZone}\n\n> *POWERED BY FLASH-MD*`);
    } else {
      await repondre("The phone number is invalid!");
    }
  } catch (e) {
    repondre("There was an error processing your request. Please try again later.");
  }
});
 

adams({ nomCom: "technews", reaction: "📰", categorie: "news" }, async (dest, zk, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  try {
    const response = await axios.get('https://fantox001-scrappy-api.vercel.app/technews/random');
    const data = response.data;

    const { thumbnail, news } = data;

    const message = `*BMW NEWS*\n\n${news}\n\n*Powered by © Ibrahim Adams*`;

    await zk.sendMessage(dest, { image: { url: thumbnail }, caption: message }, { quoted: ms });
  } catch (error) {
    console.error('Error fetching tech news:', error);
    await repondre('Sorry, there was an error retrieving the news. Please try again later.\n' + error);
  }
});


adams({
  nomCom: "mail",
  aliases: ["tempmail", "temp"], // Adding aliases
  reaction: "📧",
  categorie: "General"
}, async (dest, zk, commandeOptions) => {

  const { repondre, prefixe, ms } = commandeOptions;

  try {
    // Generate a random username for the temporary email
    const randomUsername = Math.random().toString(36).substring(2, 12);
    const tempEmail = `${randomUsername}@1secmail.com`;

    // Inform the user about their temporary email
    await zk.sendMessage(dest, { text: `Your temporary email is: ${tempEmail}\n\nYou can use this email for temporary purposes. I will notify you if you receive any emails.` }, { quoted: ms });

    // Function to extract links from email content
    const extractLinks = (text) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.match(urlRegex);
    };

    // Polling the email inbox for new emails every 30 seconds
    const checkEmails = async () => {
      try {
        const response = await fetch(`https://www.1secmail.com/api/v1/?action=getMessages&login=${randomUsername}&domain=1secmail.com`);
        const emails = await response.json();

        if (emails && emails.length > 0) {
          for (const email of emails) {
            const emailDetailsResponse = await fetch(`https://www.1secmail.com/api/v1/?action=readMessage&login=${randomUsername}&domain=1secmail.com&id=${email.id}`);
            const emailDetails = await emailDetailsResponse.json();

            const links = extractLinks(emailDetails.textBody);
            const linkText = links ? links.join('\n') : 'No links found in the email content.';

            await zk.sendMessage(dest, { text: `You have received a new email!\n\nFrom: ${emailDetails.from}\nSubject: ${emailDetails.subject}\n\n${emailDetails.textBody}\n\nLinks found:\n${linkText}` }, { quoted: ms });
          }
        }
      } catch (error) {
        console.error('Error checking temporary email:', error.message);
      }
    };

    // Start polling every 30 seconds
    const emailCheckInterval = setInterval(checkEmails, 30000);

    // Stop polling after 10 minutes (600,000 milliseconds)
    setTimeout(() => {
      clearInterval(emailCheckInterval);
      zk.sendMessage(dest, { text: 'Your temporary email session has ended. Please create a new temporary email if needed.' }, { quoted: ms });
    }, 600000); // 600000 ms = 10 minutes

  } catch (error) {
    console.error('Error generating temporary email:', error.message);
    await zk.sendMessage(dest, { text: 'Error generating temporary email. Please try again later.' }, { quoted: ms });
  }
});

adams({
  nomCom: "dalle",
  aliases: ["dall", "dal"], // Adding aliases
  reaction: "📡",
  categorie: "AI"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  try {
    if (!arg || arg.length === 0) {
      return repondre(`Please enter the necessary information to generate the image.`);
    }

    // Combine arguments into a single string
    const image = arg.join(' ');
    const data = `https://widipe.com/dalle?text=${image}`;
    
    let caption = '*Powered by BMW-MD*';
   
    zk.sendMessage(dest, { image: { url: data }, caption: caption }, { quoted: ms });

  } catch (error) {
    console.error('Erreur:', error.message || 'Une erreur s\'est produite');
    repondre("Oops, an error occurred while processing your request");
  }
});
 
adams({
  nomCom: "randomwallpaper",
  aliases: ["bestwal", "best", "bw"], // Adding aliases
  reaction: "🙌",
  categorie: "img"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  const response = await fetch('https://api.unsplash.com/photos/random?client_id=72utkjatCBC-PDcx7-Kcvgod7-QOFAm2fXwEeW8b8cc');
  const data = await response.json();
  const url = data.urls.regular;

  let buttonMessaged = {
    image: { url: url },
    caption: `*POWERED BY BWM XMD*`,
  };
  
  return await zk.sendMessage(dest, buttonMessaged, { quoted: ms });
});
 



adams({ nomCom: "random", reaction: "🥂", categorie: "abu" }, async (dest, zk, commandeOptions) => {
    const { repondre, arg, ms } = commandeOptions;
  const response = await fetch('https://api.unsplash.com/photos/random?client_id=72utkjatCBC-PDcx7-Kcvgod7-QOFAm2fXwEeW8b8cc');
const data = await response.json();
  const url =data.urls.regular
  //citel.reply ('url here :'+url);

                let buttonMessaged = {
                    image: { url: url },
                    caption: `*POWERED BY BWM XMD*`,
                    
                   
                };
                return await zk.sendMessage(dest, buttonMessaged , {quoted : ms});


}
   );

adams({ nomCom: "nature", reaction: "🦗", categorie: "img" }, async (dest, zk, commandeOptions) => {
    const { repondre, arg, ms } = commandeOptions;
  const response = await fetch('https://api.unsplash.com/photos/random?client_id=72utkjatCBC-PDcx7-Kcvgod7-QOFAm2fXwEeW8b8cc');
const data = await response.json();
  const url =data.urls.regular
  //citel.reply ('url here :'+url);

                let buttonMessaged = {
                    image: { url: url },
                    caption: `*POWERED BY BWM-XMD *`,
                    
                   
                };
                return await zk.sendMessage(dest, buttonMessaged , {quoted : ms});


}
   );


adams({
  nomCom: "time",
  reaction: "⌚",
  categorie: "General"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  try {
    if (!arg || arg.length === 0) {
      return repondre(`Enter the name of the country you want to know its time and date`);
    }

    const cal = arg.join(' ');
    const response = await fetch(`https://levanter.onrender.com/time?code=${cal}`);
    const data = await response.json();
    const timeA = data.result[0].name;
    const timeB = data.result[0].time;
    const timeC = data.result[0].timeZone;

    await repondre(`Live Time in *${timeA}* Stats:\n\n*Date & Time:* ${timeB}\n*TimeZone:* ${timeC}\n\n> *POWERED BY BWM-XMD*`);
  } catch (e) {
    repondre("That country name is incorrect!");
  }
});
 


  adams({ nomCom: "lines", reaction: "🫵", categorie: "Fun" }, async (dest, zk, commandeOptions) => {
    const { repondre, arg, ms } = commandeOptions;
 
     const response = await fetch(`https://api.maher-zubair.tech/misc/lines`);
const data = await response.json();

await repondre(data.result);
console.log(data.completion); 

  });




adams({ nomCom: "insult", reaction: "💀", categorie: "Fun" }, async (dest, zk, commandeOptions) => {
    const { repondre, arg, ms } = commandeOptions;
 
     const response = await fetch(`https://api.maher-zubair.tech/misc/insult`);
const data = await response.json();

await repondre(data.result);
console.log(data.completion); 

  });

adams({ nomCom: "enhance", reaction: "💥", categorie: "User" }, async (dest, zk, commandeOptions) => {
    const { repondre, arg, ms } = commandeOptions;
  
    try {
      if (!arg || arg.length === 0) {
        return repondre(`Please enter the Url of the image you want to enhance!`);
      }
  
      // Regrouper les arguments en une seule chaîne séparée par "-"
      const url = arg.join(' ');
      const data = `https://api.maher-zubair.tech/maker/enhance?${url}`;
      
    
      let caption = '*Enhanced by BMW-MD*';
     
     
        zk.sendMessage(dest, { image: { url: data }, caption: caption }, { quoted: ms });
      
    } catch (error) {
      console.error('Erreur:', error.message || 'Une erreur s\'est produite');
      repondre("Oops, an error occurred while processing your request");
    }
  });

adams({ nomCom: "dare", reaction: "😁", categorie: "Fun" }, async (dest, zk, commandeOptions) => {
    const { repondre, arg, ms } = commandeOptions;
 
     const response = await fetch(`https://shizoapi.onrender.com/api/texts/dare?apikey=shizo`);
const data = await response.json();

await repondre(data.result);
console.log(data.completion); 

  });



adams({ nomCom: "truth", reaction: "🤩", categorie: "Fun" }, async (dest, zk, commandeOptions) => {
    const { repondre, arg, ms } = commandeOptions;
 
     const response = await fetch(`https://shizoapi.onrender.com/api/texts/truth?apikey=shizo`);
const data = await response.json();

await repondre(data.result);
console.log(data.completion); 

  });

adams({
  nomCom: "applenews",
  reaction: "🗞️",
  categorie: "news"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  
  try {
    const response = await fetch(`https://api.maher-zubair.tech/details/ios`);
    const result = await response.json();

    if (result && result.status === 200 && result.result) {
      const newsData = result.result;

      const formattedResult = `
*BMW-MD APPLE NEWS:*\n\n
- *Title:* ${newsData.title}\n
- *Description:* ${newsData.desc.split('\n')[0]}...
- *Read More:* ${newsData.link}
\n\n> Powered by *©France King*`;

      const imageUrl = newsData.images.find(img => img && img !== "https://images.macrumors.com/images-new/1x1.trans.gif");

      if (imageUrl) {
        await zk.sendMessage(
          dest,
          {
            image: { url: imageUrl },
            caption: formattedResult.trim()
          },
          { quoted: ms }
        );
      } else {
        await zk.sendMessage(
          dest,
          { text: formattedResult.trim() },
          { quoted: ms }
        );
      }
    } else {
      await repondre("No news data found.");
    }
  } catch (error) {
    console.error('Error fetching Apple news:', error);
    await repondre("There was an error fetching the news. Please try again later.");
  }
});


adams({
  nomCom: "nasanews",
  reaction: "🗞️",
  categorie: "new"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  
  try {
    const response = await fetch(`https://api.maher-zubair.tech/details/nasa`);
    const result = await response.json();

    if (result && result.status === 200 && result.result) {
      const newsData = result.result;

      const formattedResult = `
*BMW-MD NASA NEWS:*\n\n
- *Title:* ${newsData.title}\n
- *Date:* ${newsData.date}\n
- *Description:* ${newsData.explanation.split('\n')[0]}...
\n\n> Powered by *©France King*`;

      const imageUrl = newsData.url; // Assuming the key for the image URL is urlToImage

      if (imageUrl) {
        await zk.sendMessage(
          dest,
          {
            image: { url: imageUrl },
            caption: formattedResult.trim()
          },
          { quoted: ms }
        );
      } else {
        await zk.sendMessage(
          dest,
          { text: formattedResult.trim() },
          { quoted: ms }
        );
      }
    } else {
      await repondre("No news data found.");
    }
  } catch (error) {
    console.error('Error fetching NASA news:', error);
    await repondre("There was an error fetching the news. Please try again later.");
  }
});

adams({
  nomCom: "population",
  reaction: "🗞️",
  categorie: "news"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  
  try {
    const response = await fetch(`https://api.maher-zubair.tech/details/population`);
    const result = await response.json();

    if (result && result.status === 200 && result.result) {
      const populationData = result.result;

      const pop = `*WORLDWIDE POPULATION DATA:*\n\n
- *Total Population:* ${populationData.current.total}
- *Male Population:* ${populationData.current.male}
- *Female Population:* ${populationData.current.female}
- *Births This Year:* ${populationData.this_year.births}
- *Deaths This Year:* ${populationData.this_year.deaths}
- *Births Today:* ${populationData.today.births}
- *Deaths Today:* ${populationData.today.deaths}
\n\n> *Powered by ©BMW-MD*`;

      await repondre(pop);
    } else {
      await repondre("No population data found.");
    }
  } catch (error) {
    console.error('Error fetching population data:', error);
    await repondre("There was an error fetching the population data. Please try again later.");
  }
});

adams({ 
  nomCom: "jokes", 
  reaction: "🤩", 
  categorie: "Fun" 
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  try {
    // Fetch a joke from the API
    const response = await fetch('https://api.popcat.xyz/joke');

    // Check if the response is OK
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    // Parse the JSON data
    const data = await response.json();

    // Reply with the joke
    await repondre(data.joke);
    console.log(data.joke);
  } catch (error) {
    console.error('Error fetching joke:', error.message);
    await repondre('Failed to fetch a joke. Please try again later.');
  }
});

adams({ nomCom: "advice", reaction: "🗨️", categorie: "Fun" }, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  try {
    const response = await fetch(`https://api.adviceslip.com/advice`);
    const data = await response.json();
    const quote = data.slip.advice;
    await repondre(`*Here is an advice for you:* \n${quote}`);
  } catch (error) {
    console.error('Error:', error.message || 'An error occurred');
    repondre("Oops, an error occurred while processing your request");
  }
});

adams({
  nomCom: "trivia",
  reaction: "🤔",
  categorie: "Fun"
}, async (dest, zk, commandeOptions) => {

  const { repondre, prefixe, ms } = commandeOptions;

  try {
    const response = await fetch('https://opentdb.com/api.php?amount=1&type=multiple');
    
    if (response.status !== 200) {
      return repondre(`Invalid response from the trivia API. Status code: ${response.status}`);
    }

    const result = await response.json();

    if (result && result.results && result.results[0]) {
      const trivia = result.results[0];
      const question = trivia.question;
      const correctAnswer = trivia.correct_answer;
      const allAnswers = [...trivia.incorrect_answers, correctAnswer].sort();

      const answers = allAnswers.map((answer, index) => `${index + 1}. ${answer}`).join('\n');
      
      await zk.sendMessage(dest, { text: `Here's a trivia question for you: \n\n${question}\n\n${answers}\n\nI will send the correct answer in 10 seconds...` }, { quoted: ms });
      
      setTimeout(async () => {
        await zk.sendMessage(dest, { text: `The correct answer is: ${correctAnswer}` }, { quoted: ms });
      }, 10000); // 10000 ms = 10 seconds
    } else {
      throw new Error('Invalid response format from the trivia API.');
    }
  } catch (error) {
    console.error('Error getting trivia:', error.message);
    await zk.sendMessage(dest, { text: 'Error getting trivia. Please try again later.' }, { quoted: ms });
  }
});


adams({ nomCom: "inspire", reaction: "✨", categorie: "General" }, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  try {
    const response = await fetch(`https://type.fit/api/quotes`);
    const data = await response.json();
    const randomIndex = Math.floor(Math.random() * data.length);
    const quote = data[randomIndex];
    await repondre(`*Here is an inspirational quote for you:* \n"${quote.text}" - ${quote.author}`);
  } catch (error) {
    console.error('Error:', error.message || 'An error occurred');
    repondre("Oops, an error occurred while processing your request");
  }
});
