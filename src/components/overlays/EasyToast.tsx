import { Toaster, IconName, Intent } from '@blueprintjs/core'

const toaster = Toaster.create({ position: 'top-left'})

const TOAST = {

  toast(message: string, timeout?: number, icon?: IconName, intent?: Intent) {
    toaster.show({
      message: message,
      timeout: timeout,
      icon: icon,
      intent: intent,
    })
  },

  primary(message: string, timeout?: number, icon?: IconName, intent?: Intent) {
    TOAST.toast(
      message,
      timeout || 5000,
      icon || 'console',
      intent || 'primary',
    )
  },

  success(message: string, timeout?: number, icon?: IconName, intent?: Intent) {
    TOAST.toast(
      message,
      timeout || 2000,
      icon || 'tick',
      intent || 'success',
    )
  },

  danger(message: string, timeout?: number, icon?: IconName, intent?: Intent) {
    TOAST.toast(
      message,
      timeout || 3000,
      icon || 'error',
      intent || 'danger',
    )
  },

  warning(message: string, timeout?: number, icon?: IconName, intent?: Intent) {
    TOAST.toast(
      message,
      timeout || 5000,
      icon || 'error',
      intent || 'warning',
    )
  },


}

export default TOAST