import { OpenAI } from "openai";


const setupTextarea = document.getElementById('setup-textarea')
const setupInputContainer = document.getElementById('setup-input-container')
const movieBossText = document.getElementById('movie-boss-text')


const openai = new OpenAI({ 
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true 
});
document.getElementById("send-btn").addEventListener("click", () => {
    if (setupTextarea.value) {
        const userInput = setupTextarea.value
        setupInputContainer.innerHTML = `<img src="images/loading.svg" class="loading" id="loading">`
        movieBossText.innerText = `Ok, just wait a second while my digital brain digests that...`
        fetchBotReply(userInput)
        fetchSynopsis(userInput)
    }
  
})

async function fetchBotReply(outline) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-1106',
    messages : [
        { role: "system", content: "You are an enthusiastic and creative movie writer" },
        { role: "user", content: `Generate a short message to enthusistically say an outline sounds interesting and that you need some minutes to think about it.
        ###
        outline: Two dogs fall in love and move to Hawaii to learn to surf.
        message: I'll need to think about that. But your idea is amazing! I love the bit about Hawaii!
        ###
        outline: A plane crashes in the jungle and the passengers have to walk 1000km to safety.
        message: I'll spend a few moments considering that. But I love your idea!! A disaster movie in the jungle!
        ###
        outline: A group of corrupt lawyers try to send an innocent woman to jail.
        message: Wow that is awesome! Corrupt lawyers, huh? Give me a few moments to think!
        ###
        outline: ${outline}
        message:
        ` }],
    max_tokens : 60
  })
  movieBossText.innerText = response.choices[0].message.content
  console.log(response)
}

async function fetchSynopsis(outline){
    const response = await openai.chat.completions.create({
        model : 'gpt-3.5-turbo-1106',
        messages : [
           {role : "user", content:` Generate an engaging, professional and marketable movie based on an outline. The synopsis should include
           hollywood actors names in brackets after each character. Chose characters that would be ideal for this role.
            ###
            outline: A big-headed daredevil fighter pilot goes back to school only to be sent on a deadly mission.
            synopsis: The Top Gun Naval Fighter Weapons School is where the best of the best train to refine their
            elite flying skills. When hotshot fighter pilot Maverick (Tom Cruise) is sent to the school, his reckless 
            attitude and cocky demeanor put him at odds with the other pilots, especially the cool and collected Iceman (Val Kilmer). 
            But Maverick isn't only competing to be the top fighter pilot, he's also fighting for the attention of his
            beautiful flight instructor, Charlotte Blackwood (Kelly McGillis). Maverick gradually earns the respect of his 
            instructors and peers - and also the love of Charlotte, but struggles to balance his personal and professional life. 
            As the pilots prepare for a mission against a foreign enemy, Maverick must confront his own demons and overcome the
            tragedies rooted deep in his past to become the best fighter pilot and return from the mission triumphant.
            ###
            
            outline : ${outline}
            synopsis : 
            `
        },
        ],
        max_tokens : 700
    })
    const synopsis = response.choices[0].message.content
    document.getElementById('output-text').innerText = synopsis
    fetchTitle(synopsis) 
    fetchStars(synopsis)

}

async function fetchTitle(synopsis){
    const response = await openai.chat.completions.create({
        model : 'gpt-3.5-turbo-1106',
        messages :[
            {
                role : "user" , content :`Generate a catchy movie title for this synopsis : ${synopsis}`
            }
        ],
        max_tokens : 25,
        temperature : 0.7
    })
    const title = response.choices[0].message.content
    document.getElementById('output-title').innerText = title
    fetchImagePrompt(title, synopsis)

}

async function fetchStars(synopsis){
    const response = await openai.chat.completions.create({
        model : 'gpt-3.5-turbo-1106',
        messages : [{
            role : "user" , content :`Extract names in brackets from the synopsis
            ###
            synopsis: The Top Gun Naval Fighter Weapons School is where the best of the best train to refine their
            elite flying skills. When hotshot fighter pilot Maverick (Tom Cruise) is sent to the school, his reckless 
            attitude and cocky demeanor put him at odds with the other pilots, especially the cool and collected Iceman (Val Kilmer). 
            But Maverick isn't only competing to be the top fighter pilot, he's also fighting for the attention of his
            beautiful flight instructor, Charlotte Blackwood (Kelly McGillis). Maverick gradually earns the respect of his 
            instructors and peers - and also the love of Charlotte, but struggles to balance his personal and professional life. 
            As the pilots prepare for a mission against a foreign enemy, Maverick must confront his own demons and overcome the
            tragedies rooted deep in his past to become the best fighter pilot and return from the mission triumphant.
            names: Tom Cruise, Val Kilmer, Kelly McGillis
            ###
            synopsis : ${synopsis},
            names : 
            `
        }],
        max_tokens : 30
    })
    document.getElementById('output-stars').innerText = response.choices[0].message.content
}

async function fetchImagePrompt(title, synopsis){
    const response = await openai.chat.completions.create({
        model : 'gpt-3.5-turbo-1106',
        messages :[{
            role : "user", content : `Give a short description of image which could be used to advertise a movie based on title 
            and synopsis. The description should be rich in visual detail but contain no names
            ###
            title : Love's Time Warp
            synopsis: When scientist and time traveller Wendy (Emma Watson) is sent back to the 1920s to assassinate a future
            dictator, she never expected to fall in love with them. As Wendy infiltrates the dictator's inner circle, she soon
            finds herself torn between her mission and her growing feelings for the leader (Brie Larson). With the help of a
            mysterious stranger from the future (Josh Brolin), Wendy must decide whether to carry out her mission or follow
            her heart. But the choices she makes in the 1920s will have far-reaching consequences that reverberate through
            the ages.
            image description: A silhouetted figure stands in the shadows of a 1920s speakeasy, her face turned away from the 
            camera. In the background, two people are dancing in the dim light, one wearing a flapper-style dress and the other
            wearing a dapper suit. A semi-transparent image of war is super-imposed over the scene.
            ###
            title: zero Earth
            synopsis: When bodyguard Kob (Daniel Radcliffe) is recruited by the United Nations to save planet Earth from the 
            sinister Simm (John Malkovich), an alien lord with a plan to take over the world, he reluctantly accepts the 
            challenge. With the help of his loyal sidekick, a brave and resourceful hamster named Gizmo (Gaten Matarazzo), 
            Kob embarks on a perilous mission to destroy Simm. Along the way, he discovers a newfound courage and strength as 
            he battles Simm's merciless forces. With the fate of the world in his hands, Kob must find a way to defeat the alien
            lord and save the planet.
            image description: A tired and bloodied bodyguard and hamster standing atop a tall skyscraper, looking out over a
            vibrant cityscape, with a rainbow in the sky above them.
            ###
            title : ${title}
            synopsos : ${synopsis}
            "image description" : `
        }],
        max_tokens : 100,      
        temperature : 1.1 
    })
    fetchImageUrl(response.choices[0].message.content)
}

async function fetchImageUrl(imagePrompt){
    const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: `${imagePrompt} There should be no text in the image`,
        n: 1,
        size: "1024x1024",
        response_format : 'url'
    })
    const image_url = response.data[0].url;
    console.log(image_url)
    document.getElementById('output-img-container').innerHTML = `<img src = "${image_url}">`
}