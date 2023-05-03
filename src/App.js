import "./App.css";
import { useState, useEffect } from "react";
import Select from "react-select";

function App() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [symbols, setSymbols] = useState([]);
  const [price, setPrice] = useState(0);
  const [investAmount, setInvestAmount] = useState(null);
  const [estimatedEth, setEstimatedEth] = useState(0);

  useEffect(() => {
    fetch("https://api.binance.com/api/v3/ticker/price")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const symbols = data.map((item) => {
          return {
            label: item.symbol,
            value: item.symbol,
          };
        });
        setSymbols(symbols);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (selectedOption) {
      const symbolData = symbols.find(
        (item) => item.value === selectedOption.value
      );
      fetch(
        `https://api.binance.com/api/v3/ticker/price?symbol=${symbolData.value}`
      )
        .then((response) => response.json())
        .then((data) => {
          setPrice(parseFloat(data.price));
        })
        .catch((error) => console.error(error));
    }
  }, [selectedOption, symbols]);

  useEffect(() => {
    if (investAmount && price) {
      const ethPrice = 149825; // current ETH price in INR
      const estimatedEth = (investAmount * ethPrice) / price;
      setEstimatedEth(estimatedEth);
    }
  }, [investAmount, price]);

  const handleInvestAmountChange = (event) => {
    const value = parseFloat(event.target.value);
    setInvestAmount(value);
  };

  return (
    <div className="App">
      <div className="Header">
        <div>
          <img className="logo" src="../../neofi_logo.png" alt="logo" />
        </div>
        <div className="menu">
          <ul>
            <li className="trade">Trade</li>
            <li className="earn">Earn</li>
            <li className="earn">Support</li>
            <li className="about">About</li>
          </ul>
        </div>
        <div className="connect">
          <div className="connect-button" type="submit">
            Connect Wallet
          </div>
        </div>
      </div>
      <div className="body">
        <div className="box">
          <img className="form-logo" src="../../logo-1.png" alt="logo" />
          <form>
            <div className="container">
              <div className="top-box">
                <div className="current-value">Current Value</div>
                <div className="value">
                  ₹{Math.floor(price.toFixed(2) * 80)}
                </div>
              </div>
              <br></br>
              <Select
                className="dropdown"
                options={symbols}
                value={selectedOption}
                onChange={setSelectedOption}
                placeholder="Search chains"
              />
              <label className="input1">Amount you want to invest</label>
              <input
                className="input1-value"
                type="number"
                placeholder="0.00                                                      INR"
                name="investAmount"
                value={investAmount}
                onChange={handleInvestAmountChange}
                required
              />
              <label className="input2">
                Estimate Number of ETH You will Get
              </label>
              <input
                className="input2-value"
                type="number"
                placeholder="0.00"
                name="estimatedETH"
                value={estimatedEth}
                disabled
                required
              />
              <button className="buy-button">Buy</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
