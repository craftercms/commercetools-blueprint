/*
 * MIT License
 *
 * Copyright (c) 2021 Crafter Software Corporation. All Rights Reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/* eslint-disable react/no-array-index-key */
import React, { useEffect, useReducer } from 'react';
import Carousel, { Modal, ModalGateway } from 'react-images';

function ProductGallery(props) {

  const [state, setState] = useReducer(
    (a, b) => ({ ...a, ...b }),
    {
      image: null,
      currentIndex: 0,
      lightboxIsOpen: false,
    }
  );

  const { images } = props;

  const { image, currentIndex, lightboxIsOpen } = state;

  const changeImg = (index, e) => {
    e.preventDefault();
    setState({
      currentIndex: index,
      image: images[index]
    });
  };

  const openLightbox = (event) => {
    event.preventDefault();
    setState({ lightboxIsOpen: true });
  };

  useEffect(
    () => {
      const index = 0;
      setState({
        image: images[index],
        currentIndex: index
      });
    },
    [images]
  );

  return (
    <div className="product-gallery">
      {
        (images && images.length && image)
          ? (
            <>
              <a
                className="product-gallery__current-img"
                onClick={e => openLightbox(e)}
                href={state.image.src}
              >
                <img src={state.image.src} className="product-img" alt={""}/>
              </a>
              <div className="product_gallery__gallery">
                {images.map((img, i) => (
                  <button type="button" key={i} onClick={e => changeImg(i, e)} className="product-gallery__img-preview">
                    <img src={img.src} alt="product-img"/>
                  </button>
                ))}
              </div>
              <ModalGateway>
                {lightboxIsOpen ? (
                  <Modal onClose={() => setState({ lightboxIsOpen: false })}>
                    <Carousel currentIndex={currentIndex} views={images}/>
                  </Modal>
                ) : null}
              </ModalGateway>
            </>
          ) : (
            <div className="text-center">No images are available for this product.</div>
          )
      }
    </div>
  );

}

export default ProductGallery;
