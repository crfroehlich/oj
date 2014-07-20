

  friendlyName = 'noty'

  OJ.notifications.register friendlyName, (options, owner) ->
    defaults =
      layout: 'topRight'
      theme: 'defaultTheme'
      type: 'alert'
      text: '' #can be html or string
      dismissQueue: true #If you want to use queue feature set this true
      template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
      animation:
        open:
          height: 'toggle'
        close:
          height: 'toggle'
        easing: 'swing'
        speed: 500 #opening & closing animation speed
      timeout: 5000 #delay for closing event. Set false for sticky notifications
      force: false #adds notification to the beginning of queue when set to true
      modal: false
      maxVisible: 5 #you can set max visible notification for dismissQueue true option,
      killer: false #for close all notifications before show
      closeWith: ['click']  #['click', 'button', 'hover']
      callback:
        onShow: OJ.noop,
        afterShow: OJ.noop
        onClose: OJ.noop
        afterClose: OJ.noop
      buttons: false #an array of buttons

    OJ.extend defaults, options, true
    ret = noty defaults

    ret

  return



