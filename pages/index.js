import { Component } from 'react'
import { HomeImage } from '../components'
import Carousel, { Modal, ModalGateway } from 'react-images'
import '../public/sass/home.scss'

const FooterCaption = () => {
  return (
    <span>
      Example text
    </span>
  )
}

const client = require('contentful').createClient({
  space: process.env.SPACE_ID,
  accessToken: process.env.ACCESS_TOKEN
})

class Home extends Component {
  constructor () {
    super()

    this.state = {
      projects: [],
      photoIndex: 0,
      isOpen: false
    }
  }

  async componentDidMount () {
    const contentType = await client.getContentType('galleryImage')
    const projects = await this.fetchEntriesForContentType(contentType)
    this.setState({ projects }, () => {
      this.resizeImages()
    })

    window.addEventListener('resize', this.resizeImages)
  }

  resizeImages = () => {
    const projectList = document.getElementsByClassName('gallery-image')

    for (let i = 0; i < projectList.length; i++) {
      projectList[i].style.height = projectList[i].offsetWidth * 0.8 + 'px'

      const image = projectList[i].firstChild
      image.onload = function () {
        const ratio = image.offsetWidth / image.offsetHeight
        const galleryRatio = projectList[i].offsetWidth / projectList[i].offsetHeight

        if (ratio < galleryRatio) {
          image.style.width = '100%'
        } else {
          image.style.height = '100%'
        }
      }
    }
  }

  fetchEntriesForContentType = async (contentType) => {
    const entries = await client.getEntries({
      content_type: contentType.sys.id,
      limit: 12
    })
    if (entries.items) return entries.items
    console.log(`Error getting Entries for ${contentType.name}.`)
  }

  open = (i) => {
    this.setState({ isOpen: true, photoIndex: i })
  }

  close = () => {
    this.setState({ isOpen: false })
  }

  render () {
    const { projects, isOpen, photoIndex } = this.state

    const images = projects && projects.map(p => {
      return {
        src: p.fields.image.fields.file.url
      }
    })

    return (
      <div className='home-container'>
        <p style={{ width: '800px', margin: '40px auto 35px', fontSize: '20px', padding: '0 5px' }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
        <div className='gallery'>
          {projects.length > 0
            ? projects.map((p, i) => (
              <HomeImage
                key={i}
                index={i}
                image={p.fields.image.fields.file.url + '?fit=fill'}
                onClick={this.open}
              />
            ))
            : null}
        </div>

        <ModalGateway>
          {isOpen && (
            <Modal onClose={this.close}>
              <Carousel currentIndex={photoIndex} views={images} components={{ FooterCaption }} />
            </Modal>

          )}
        </ModalGateway>
      </div>
    )
  }
}

export default Home
