import { rootStore, RootStoreProvider } from './stores/RootStore';
import { Game } from './components/Game';

function App() {
  return (
    <RootStoreProvider value={rootStore}>
      <Game />
    </RootStoreProvider>
  );
}

export default App;
