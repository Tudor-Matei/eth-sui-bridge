import "@mysten/dapp-kit/dist/index.css";
import Transfer from "./components/Transfer";
import Utilities from "./components/Utilities";
import "./index.css";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum: any;
  }
}
const App = () => {
  return (
    <div className="App">
      <Utilities />
      <Transfer />
    </div>
  );
};

export default App;
