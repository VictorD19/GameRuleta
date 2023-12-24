import Image from "next/image"
import Images from '../../Assert/Carrusel'
import { Carousel } from "react-bootstrap"
import styled from "styled-components"

const ImageCompo = styled(Image)`
   width: 100%;
      @media only screen and (max-width: 767px) {
    height: 160px;
  }
`

export const CarruselComponet = () => {

    let images = ["Image1", "Image2"]

    return (<Carousel>
        {images.map((imga, i) => (<Carousel.Item key={"ImageCarrusel_" + i}>
            <ImageCompo src={Images[imga]} alt="itemCarrulse" />
        </Carousel.Item>))}
    </Carousel>)
}