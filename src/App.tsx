import { AppProvider, useApp } from './context/AppContext'
import { LanguageProvider } from './context/LanguageContext'
import Header from './components/Header'
import HomeScreen from './components/screens/HomeScreen'
import SettingsScreen from './components/screens/SettingsScreen'
import PlayerRevealScreen from './components/screens/PlayerRevealScreen'
import DiscussionScreen from './components/screens/DiscussionScreen'
import ResultScreen from './components/screens/ResultScreen'

function ScreenRouter() {
  const { state } = useApp()
  switch (state.screen) {
    case 'home': return <HomeScreen />
    case 'settings': return <SettingsScreen />
    case 'reveal': return <PlayerRevealScreen />
    case 'discussion': return <DiscussionScreen />
    case 'result': return <ResultScreen />
  }
}

export default function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <div className="min-h-screen bg-gray-900 flex flex-col">
          <Header />
          <main className="flex flex-col flex-1">
            <ScreenRouter />
          </main>
        </div>
      </AppProvider>
    </LanguageProvider>
  )
}
