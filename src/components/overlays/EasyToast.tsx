import { Toaster, IconName, Intent, IActionProps } from '@blueprintjs/core'

const toaster = Toaster.create({ position: 'top-left'})

const TOAST = {

  toast(message: string, timeout?: number, icon?: IconName, intent?: Intent, action?: IActionProps) {
    toaster.show({
      message,
      timeout,
      icon,
      intent,
      action,
    })
  },

  primary(message: string, timeout?: number, icon?: IconName, action?: IActionProps) {
    TOAST.toast(
      message,
      timeout || 5000,
      icon || 'console',
      'primary',
      action,
    )
  },

  success(message: string, timeout?: number, icon?: IconName, action?: IActionProps) {
    TOAST.toast(
      message,
      timeout || 2000,
      icon || 'tick',
      'success',
      action,
    )
  },

  danger(message: string, timeout?: number, icon?: IconName, action?: IActionProps) {
    TOAST.toast(
      message,
      timeout || 3000,
      icon || 'error',
      'danger',
      action,
    )
  },

  warning(message: string, timeout?: number, icon?: IconName, action?: IActionProps) {
    TOAST.toast(
      message,
      timeout || 5000,
      icon || 'error',
      'warning',
      action,
    )
  },


}

export default TOAST