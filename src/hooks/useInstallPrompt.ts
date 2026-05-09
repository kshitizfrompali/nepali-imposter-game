import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface InstallPromptState {
  canInstall: boolean
  isIOS: boolean
  isStandalone: boolean
  install: () => Promise<'accepted' | 'dismissed' | 'unavailable'>
}

const isBrowser = typeof window !== 'undefined'

function detectStandalone(): boolean {
  if (!isBrowser) return false
  if (window.matchMedia('(display-mode: standalone)').matches) return true
  return (window.navigator as { standalone?: boolean }).standalone === true
}

function detectIOS(): boolean {
  if (!isBrowser) return false
  const ua = window.navigator.userAgent
  return /iPad|iPhone|iPod/.test(ua) && !(window as { MSStream?: unknown }).MSStream
}

export function useInstallPrompt(): InstallPromptState {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)
  const [isStandalone, setIsStandalone] = useState(detectStandalone)

  useEffect(() => {
    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    function handleAppInstalled() {
      setInstalled(true)
      setDeferred(null)
      setIsStandalone(true)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  async function install(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
    if (!deferred) return 'unavailable'
    await deferred.prompt()
    const { outcome } = await deferred.userChoice
    setDeferred(null)
    return outcome
  }

  return {
    canInstall: !!deferred && !installed && !isStandalone,
    isIOS: detectIOS() && !isStandalone,
    isStandalone,
    install,
  }
}
