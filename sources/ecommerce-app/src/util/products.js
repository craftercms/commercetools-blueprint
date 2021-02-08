import { ajax } from 'rxjs/ajax';
import { useSelector } from 'react-redux';

export function getProducts(params = {}) {

  const qs = Object.entries({
    locale: 'en',
    currency: 'USD',
    ...(params || {})
  }).map(([key, value]) => `${key}=${value}`);

  return ajax.get(`/api/1/product/all.json${qs.length > 0 ? '?' : ''}${qs.join('&')}`);

}

export function useProductsQuery(params = {}) {
  const { query: { currency, locale } } = useSelector(state => state.products);
  return { currency, locale, ...params };
}
