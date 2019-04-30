const CronJob = require('cron').CronJob
const puppeteer = require('puppeteer')

// temporary html until proper frontend is developed
let pageContent = '<h1>Please come back a bit later...</h1>'

// const job = new CronJob('0 */5 * * * *', async () => {
const job = new CronJob('*/30 * * * * *', async () => {
  try {
    console.log('Cron job STARTED:', new Date())
    const content = await returnContent()
    pageContent = renderLinks(content)
    console.log('Cron job FINISHED:', new Date())
  } catch (error) {
    console.log(`Cron job FAILED: ${ error }`)
  }
})

job.start()


const youtubeChannelUrl = [
  {
    title: 'FitnessFAQs',
    site: 'https://www.youtube.com/user/FitnessFAQs/videos'
  },
  {
    title: 'Jeremy Ethier',
    site: 'https://www.youtube.com/channel/UCERm5yFZ1SptUEU4wZ2vJvw/videos'
  },
  {
    title: 'Antranik',
    site: 'https://www.youtube.com/user/AntranikDotOrg/videos'
  },
  {
    title: 'GMB Fitness',
    site: 'https://www.youtube.com/user/GoldMedalBodiesVids'
  },
  {
    title: 'Calisthenic Movement',
    site: 'https://www.youtube.com/user/Calisthenicmovement/videos'
  }
]

const returnContent = async () => {
  // FOR LOCAL USE
  const browser = await puppeteer.launch()

  // FOR AWS USE
  // const browser = await puppeteer.launch({
  //   executablePath: '/usr/bin/google-chrome-stable',
  //   headless: true,
  //   args: ['--no-sandbox', '--disable-setuid-sandbox']
  // })

  const page = await browser.newPage()
  let content = []

  for(let i = 0; i < youtubeChannelUrl.length; i++) {
    await page.goto(youtubeChannelUrl[i].site)

    const currentChannelContent = await page.evaluate(() => {
      const videos = document.querySelectorAll('#items #video-title')
      
      return Array.from(videos)
        .map(video => ({
          title: video.innerText,
          url: video.href
        }))
        .slice(0, 5)
    })

    content = [...content, { title: youtubeChannelUrl[i].title, videos: [...currentChannelContent] }]
  }

  await browser.close();

  return content
}

// temporary html until proper frontend is being created
const renderLinks = content => {
  const linkTemplate = ({ title, url }) => `<li><a href="${ url }">${ title }</a></li>`
  const list = content.map(creator => {
    const title = `<h1>${ creator.title }</h1>`

    return creator.videos.reduce((accummulator, link) => accummulator += linkTemplate(link), title)
  })

  return `<ul>${ list }</ul>`
}

const getPageContent = () => pageContent

module.exports = getPageContent