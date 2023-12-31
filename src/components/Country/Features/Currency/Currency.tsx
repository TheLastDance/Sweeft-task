import './Currency.css';
import { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Search from '../../Search/Search';
import { ICountryName, IExchangeRate } from '../../../../types/types';
import { CountryContext } from '../../../../context/CountryListProvider';
import { useRequest } from '../../../../customHooks/useRequest';
import { LoadingOverlay } from '../../../LoadingOverlay/LoadingOverlay';

const Currency: React.FC = () => {
  const { data } = useContext(CountryContext);
  const { country } = useParams();
  const [currencyCountry, setCurrencyCountry] = useState(country);
  const [currency, setCurrency] = useState('');
  const [firstCountryCurrencyAmount, setfirstCountryCurrencyAmount] = useState(0);
  const [secondCountryCurrencyAmount, setSecondCountryCurrencyAmount] = useState(0);
  const { response, isLoading } = useRequest<IExchangeRate, string>([currency], `https://v6.exchangerate-api.com/v6/edae0ac24bb9dd554423e495/latest/${currency}`, currency, currency);
  // https://api.exchangerate.host/latest?base=${currency}
  //`https://api.exchangerate.host/live?access_key=8888e37dc9452010d2f18e3490b6f6ae&source=${currency}`

  function handleCurrency(item: ICountryName) {
    setCurrencyCountry(item.name.common)
  }

  function handleCurrencyChange(e: React.ChangeEvent<HTMLInputElement>) {
    setfirstCountryCurrencyAmount(+e.target.value);
  }

  function updateCurrencyCode(country: string | undefined) {
    const matchingCountry = data.find((item) => item.name.common === country);
    const code = matchingCountry ? Object.keys(matchingCountry.currencies)[0] : '';

    return code;
  }

  useEffect(() => {
    setCurrency(updateCurrencyCode(country))
  }, [data, country, currencyCountry])

  useEffect(() => {
    if (!Array.isArray(response)) {
      setSecondCountryCurrencyAmount(firstCountryCurrencyAmount * response.conversion_rates[updateCurrencyCode(currencyCountry)])
      //setSecondCountryCurrencyAmount(firstCountryCurrencyAmount * response.quotes[updateCurrencyCode(country)+updateCurrencyCode(currencyCountry)])
    }
  }, [firstCountryCurrencyAmount, currencyCountry, response])

  console.log(response);


  return (
    <div className='currency'>
      <h1>Currency Exchange</h1>
      <Search country={country} currencyCountry={currencyCountry} handleCurrency={handleCurrency} />
      <div className='currency_inputs'>
        <label>
          <span>{data && currencyCountry && data.find((item) => item.name.common === country)?.currencies[updateCurrencyCode(country)].symbol}</span>
          <input type="number" value={firstCountryCurrencyAmount} onChange={(e) => handleCurrencyChange(e)} />
        </label>
        <div className='equality_sign'><span>=</span></div>
        <label>
          <span>{data && data.find((item) => item.name.common === currencyCountry)?.currencies[updateCurrencyCode(currencyCountry)].symbol}</span>
          <input type="number" disabled value={secondCountryCurrencyAmount.toFixed(2)} />
        </label>
      </div>
      <LoadingOverlay isVisible={isLoading} />
    </div>
  )
}

export default Currency;