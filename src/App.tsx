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
        <div className="h-full flex flex-col bg-gradient-to-br from-[#0d0d1a] to-[#080810] overflow-hidden">
          <Header />
          <main className="flex flex-col flex-1 min-h-0">
            <ScreenRouter />
          </main>
        </div>
      </AppProvider>
    </LanguageProvider>
  )
}
