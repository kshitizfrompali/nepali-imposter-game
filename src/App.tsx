import { AppProvider, useApp } from './context/AppContext'
import { LanguageProvider } from './context/LanguageContext'
import Header from './components/Header'
import HomeScreen from './components/screens/HomeScreen'

function ScreenRouter() {
  const { state } = useApp()
  if (state.screen === 'settings') return <div className="p-4 text-white">Settings coming soon...</div>
  return <HomeScreen />
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
