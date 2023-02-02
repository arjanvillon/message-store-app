import { WagmiConfig, createClient } from "wagmi";
import { getDefaultProvider } from "ethers";

import Main from "./Main";

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(5),
});

function App() {
  return (
    <WagmiConfig client={client}>
      <Main />
    </WagmiConfig>
  );
}

export default App;
