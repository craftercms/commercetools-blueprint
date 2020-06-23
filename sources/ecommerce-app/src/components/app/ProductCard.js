/*
 * MIT License
 *
 * Copyright (c) 2019 Crafter Software Corporation. All Rights Reserved.
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

import React, { useEffect, useReducer, useState } from 'react';
import {
  Card, CardBody, ButtonToolbar, Button, Modal,
} from 'reactstrap';
import ProductGallery from './ProductGallery';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import {
  addToCart,
  fetchCart, fetchProduct,
  removeFromCart,
  updateCartItemQuantity
} from '../../redux/actions/productsActions';
import { money } from '../../util/string';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from 'mdi-react/ShoppingCartIcon';
import Ratings from 'react-ratings-declarative';
import Alert from '../shared/Alert';
import { useCartUpdateInFlight } from '../../util/component';

const isSale = false;

const reducer = (a, b) => ({ ...a, ...b });

export function useMergeState(initialState) {
  return useReducer(reducer, initialState);
}

function ProductCard(props) {

  const dispatch = useDispatch();

  const { cart } = useSelector(state => state.products);
  const { user } = useSelector(state => state.users);
  const { product } = props;
  const currency = product.variants[0].currency;

  const [images, setImages] = useState([]);
  const [variant, setVariant] = useState();
  const [cartItem, setCartItem] = useMergeState({
    id: null,
    productId: product.id,
    variantId: null,
    quantity: 1
  });

  const isInCart = cartItem.id != null;
  const updatesInFlight = useCartUpdateInFlight();

  useEffect(
    () => {
      !cart && dispatch(fetchCart())
    },
    []
  );

  useEffect(
    () => {
      setVariant(product.variants[0]);
    },
    [product.id, currency]
  );

  useEffect(
    () => {
      setImages(
        (
          variant != null
            ? [variant]
            : product.variants
        ).reduce(
          (images, iVariant) => images.concat(
            iVariant.images.map((img) => ({ ...img, src: img.url }))
          ),
          []
        )
      );

      if (variant == null)
        return;

      const item = (
        cart
          ? cart.items.find((item) => (
            item.variantId === variant.id &&
            item.productId === product.id
          ))
          : null
      );

      setCartItem({
        variantId: variant.id,
        productId: product.id,
        ...(
          item
            ? { id: item.id, quantity: item.quantity }
            : { id: null, quantity: 1 }
        )
      });

    },
    [variant, cart]
  );

  return (
    <Card>
      <CardBody>
        <div className="product-card">
          <ProductGallery images={images}/>
          <div className="product-card__info">
            <h1 className="product-card__title">{product.name}</h1>
            {
              cartItem.variantId &&
              <h2 className="product-card__price">
                {money(variant.price, variant.currency)}
                {isSale && <span className="product-card__old-price">$23</span>}
              </h2>
            }
            {product.description && <p>{product.description}</p>}
            <form className="form product-card__form">
              <div className="form__form-group">
                <span className="form__form-group-label product-card__form-label">Select</span>
                <div className="form__form-group-field">
                  <VariantSelection
                    value={variant}
                    variants={product.variants}
                    onChange={({ variant }) => setVariant(variant)}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label product-card__form-label">Quantity</span>
                <div className="form__form-group-field">
                  <input
                    type="number"
                    disabled={updatesInFlight}
                    value={cartItem.quantity}
                    onChange={(e) => onUpdateQuantity(e.target.value)}
                  />
                </div>
              </div>
              <ButtonToolbar className="product-card__btn-toolbar">
                {
                  isInCart
                    ? (
                      <ButtonToolbar className="product-card__btn-toolbar">
                        <button
                          type="button"
                          className="btn btn-warning"
                          disabled={updatesInFlight}
                          onClick={onRemoveFromCart}
                        >
                          Remove from cart
                        </button>
                        <Link to="/cart" className="product-card__wish-btn">
                          <ShoppingCartIcon/> View cart
                        </Link>
                      </ButtonToolbar>
                    ) : (
                      <ButtonToolbar className="product-card__btn-toolbar">
                        <button
                          type="button"
                          className="btn btn-primary"
                          disabled={!cartItem.variantId || updatesInFlight}
                          onClick={onAddToCart}
                        >
                          Add to cart
                        </button>
                        {
                          variant &&
                          !variant.onStock &&
                          <span className="product-card__not-in-stock">
                            (On backorder)
                          </span>
                        }
                      </ButtonToolbar>
                    )
                }
              </ButtonToolbar>
            </form>
            <div className="product-card_ _rate">
              <SubmitReview
                product={product}
                isLoggedIn={!!user}
                onSuccess={() => dispatch(fetchProduct(product.id))}
              />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  function onAddToCart() {
    (cartItem.quantity > 0) && dispatch(
      addToCart(cartItem)
    );
  }

  function onRemoveFromCart() {
    isInCart && dispatch(
      removeFromCart(cartItem)
    );
  }

  function onUpdateQuantity(nextQuantity) {
    nextQuantity = parseInt(nextQuantity, 10);
    if (nextQuantity < 0) {
      nextQuantity = 0;
    }
    if (isInCart) {
      dispatch(
        updateCartItemQuantity({ ...cartItem, quantity: nextQuantity })
      );
    }
    setCartItem({ quantity: nextQuantity });
  }

}

function SubmitReview(props) {

  const { product, isLoggedIn, onSuccess } = props;
  const { rating, name } = product;

  const [value, setValue] = useState();
  const [comments, setComments] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState();

  const toggleOpen = () => setOpenModal(!openModal);
  const submit = () => {
    fetch(
      `/api/1/product/${product.id}/review.json`,
      {
        body: JSON.stringify({ rating: value, text: comments }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' }
      }
    ).then(async (response) => {
      const data = await response.json();
      if (response.status === 200) {
        setValue();
        setMessage();
        setComments('');
        setOpenModal(false);
        onSuccess && onSuccess(response);
      } else {
        setMessage({ type: 'danger', text: data.message });
      }
    });
  };

  const
    widgetEmptyColors = '#ccc',
    widgetHoverColors = '#FFCC00',
    widgetRatedColors = '#FFCC00',
    widgetDimensions = '20px',
    widgetSpacings = '5px';

  return (
    <div className="rating-widget">
      <section className="rating-widget__header">
        <div className="rating-widget__average">
          <div>
            <Ratings
              rating={rating == null ? 0 : rating.average}
              widgetEmptyColors={widgetEmptyColors}
              widgetHoverColors={widgetHoverColors}
              widgetRatedColors={widgetRatedColors}
              widgetDimensions={widgetDimensions}
              widgetSpacings={widgetSpacings}
            >
              <Ratings.Widget/>
              <Ratings.Widget/>
              <Ratings.Widget/>
              <Ratings.Widget/>
              <Ratings.Widget/>
            </Ratings>
          </div>
          <span className="rating-widget__label">
            {
              rating == null
                ? 'No reviews yet.'
                : `${rating.reviews} review${rating.reviews > 1 ? 's' : ''}. ${rating.average} average rating.`
            }
          </span>
        </div>
        <div className="rating-widget__user">
          {
            isLoggedIn &&
            <Button outline className="btn-sm" onClick={toggleOpen}>
              Submit a review
            </Button>
          }
        </div>
      </section>
      <section className="rating-widget__reviews">
        {
          // rating && JSON.stringify(rating.reviews, null, '  ')
          // rating && rating.reviews.map(review =>
          // <div className="rating-widget__review"></div>
          // )
        }
      </section>
      <Modal
        isOpen={openModal}
        toggle={toggleOpen}
        className={`modal-dialog--`}
      >
        <div className="modal__header">
          <button className="lnr lnr-cross modal__close-btn" type="button" onClick={toggleOpen}/>
          <h3 className="bold-text  modal__title">Review "{name}"</h3>
        </div>
        <div className="modal__body">
          <div className="form">
            {
              message &&
              <Alert color={message.type} className="alert--bordered">
                <span>{message.text}</span>
              </Alert>
            }
            <div className="form__form-group">
              <div>
                <Ratings
                  rating={value}
                  changeRating={setValue}
                  widgetEmptyColors={widgetEmptyColors}
                  widgetHoverColors={widgetHoverColors}
                  widgetRatedColors={widgetRatedColors}
                  widgetDimensions={widgetDimensions}
                  widgetSpacings={widgetSpacings}
                >
                  <Ratings.Widget/>
                  <Ratings.Widget/>
                  <Ratings.Widget/>
                  <Ratings.Widget/>
                  <Ratings.Widget/>
                </Ratings>
              </div>
              <span className="rating-widget__label">
                {value ? `Your rating: ${value} star${value > 1 ? 's' : ''}.` : `How would you rate ${name}?`}
              </span>
            </div>
            <div className="form__form-group">
              <div className="form__form-group-field">
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder={`Any additional comments...`}
                />
              </div>
            </div>
          </div>
        </div>
        <ButtonToolbar className="modal__footer">
          <Button onClick={toggleOpen}>Cancel</Button>
          <Button outline onClick={submit} disabled={value == null}>Ok</Button>
        </ButtonToolbar>
      </Modal>
    </div>
  );

}

export function VariantSelection(props) {
  const { variants, value, onChange, placeholder, components } = props;
  const options = variants ? variants.map((variant) => ({
    value: variant.id,
    label: getVariantLabel(variant),
    variant
  })) : [];
  const option = value ? { value: value.id, label: getVariantLabel(value), variant: value } : null;
  return (
    <Select
      value={option}
      onChange={onChange}
      options={options}
      clearable={false}
      className="react-select"
      classNamePrefix="react-select"
      placeholder={placeholder}
      components={components}
    />
  );
}

VariantSelection.defaultProps = {
  options: null,
  components: {
    Option: function Option({ innerProps, isDisabled, data }) {
      data = data.variant;
      const label = getVariantLabel(data);
      const color = data.attributes.filter((attr) => attr.name === 'Color').map((attr) => attr.value.toLowerCase())[0];
      // noinspection JSConstructorReturnsPrimitive
      return (!isDisabled ? (
        <div
          className="react-select__option"
          {...innerProps}
        >
          {label}
          {
            color &&
            <span
              className="react-select__color"
              style={{ backgroundColor: color, boxShadow: '0 0 1px 0 rgba(0,0,0,.5)' }}
            />
          }
        </div>
      ) : null);
    }
  },
  onChange: () => void null,
  placeholder: 'Select...',
};

function getVariantLabel(variant) {
  return variant.attributes.filter((attr) => attr.name === 'Filtersize').map((attr) => attr.value.label);
}

export default ProductCard;
