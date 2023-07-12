// If the event if a pointer event, normalize it to touch event
function normalizeTouchEvent(event) {
  let normalizedEvent = {};
  if (event.type === 'pointerdown' || event.type === 'pointermove' || event.type === 'pointerup') {
    normalizedEvent.changedTouches = [{
      clientX: event.clientX,
      clientY: event.clientY,
      identifier: event.pointerId
    }];

  }
  else if (event.type === 'touchstart' || event.type === 'touchmove' || event.type === 'touchend') {
    normalizedEvent = event;
  }
  return normalizedEvent;
}

function calculateAngularDirection(rAngle) {
  var angle45 = Math.PI / 4;
  var direction;

  // Angular direction
  //     \  UP /
  //      \   /
  // LEFT       RIGHT
  //      /   \
  //     /DOWN \
  //
  if (
    rAngle > angle45 &&
    rAngle < (angle45 * 3)
  ) {
    direction = 'up';
  } else if (
    rAngle > -angle45 &&
    rAngle <= angle45
  ) {
    direction = 'right';
  } else if (
    rAngle > (-angle45 * 3) &&
    rAngle <= -angle45
  ) {
    direction = 'down';
  } else {
    direction = 'left';
  }
  return direction;
}

const commonButtonElementCss = {
  userSelect: "none",
  position: "fixed",
  transition: "opacity 0.3s 0.1s",
  willChange: "opacity",
  height: '70px',
  width: '95px',
  right: '0px',
  backgroundSize: '25px',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontSize: '15px',
  fontFamily: 'sans-serif',
};

const commonButtonBorderCss = {
  position: "absolute",
  top: 'calc(50% - 30px)',
  left: 'calc(50% - 30px)',
  height: '60px',
  width: '60px',
  border: '2px solid #fff',
  borderRadius: '10px',
  boxSizing: 'border-box',
  opacity: '0.25',
  willChange: 'opacity',
}

const commonZoneCss = {
  position: "absolute",
  backgroundSize: '25px',
  top: "10px",
  left: "10px",
  width: "calc(100% - 20px)",
  height: "calc(100% - 20px)",
  display: 'flex',
  backgroundRepeat: 'no-repeat',
  color: '#fff',
  fontSize: '15px',
  fontFamily: 'sans-serif',
}

const defaultButtonCss = [
  { element: { ...commonButtonElementCss, bottom: "15px" }, border: { ...commonButtonBorderCss } },
  { element: { ...commonButtonElementCss, bottom: "calc(70px + 15px)" }, border: { ...commonButtonBorderCss } },
  { element: { ...commonButtonElementCss, bottom: "calc(70px * 2 + 15px)" }, border: { ...commonButtonBorderCss } },
  { element: { ...commonButtonElementCss, bottom: "calc(70px * 3 + 15px)" }, border: { ...commonButtonBorderCss } },
]

const defaultConfig = {
  type: "angle",
  buttons: [],
  joystick: {
    zones: {}
  }
}

function mergeConfigWithDefault(config = {}) {
  config.type = config.type || defaultConfig.type;
  // merge joystick config
  config.joystick = config.joystick || defaultConfig.joystick;
  config.joystick = {...defaultConfig.joystick, ...config.joystick};
  if (config.buttons && config.buttons.length > 0) {
    if (defaultButtonCss.length <= config.buttons.length)
      throw new Error(`Only ${defaultButtonCss.length} buttons are supported.`);
    config.buttons = config.buttons.map((button, index) => {
      // merge css of element and border
      let merged = {
        ...button,
        css: {
          element: { ...defaultButtonCss[index].element, ...button.css?.element },
          border: { ...defaultButtonCss[index].border, ...button.css?.border },
        }
      };
      if (button.icon) {
        merged.css.element.backgroundImage = `url(${button.icon})`;
      }
      return merged;
    })
  }
  console.log("config", config);
  return config;
}

export default class Controls {
  constructor(playerState, isMyPlayer, config = defaultConfig) {
    this.buttons = {};
    this.joystick = {};
    this.playerState = playerState;
    config = mergeConfigWithDefault(config);
    this.config = config;
    if (isMyPlayer) {
      this.initControls(config);
    }
  }

  isPressed(buttonId) {
    return this.playerState.getState("ctr-" + buttonId);
  }

  isJoystickPressed() {
    return this.isPressed("joystick");
  }

  angle() {
    return this.playerState.getState("ctr-angle") || 0;
  }

  initControls(config) {
    this.setupJoystick(config.joystick);
    if (config.buttons && config.buttons.length > 0) {
      config.buttons.forEach((buttonConfig) => {
        this.setupButton(buttonConfig);
      });
    }
  }

  setupJoystick(config) {
    /**
     * Joystick
     */
    this.joystick.active = false

    // Element
    this.joystick.$element = document.createElement('div')
    this.joystick.$element.style.userSelect = 'none'
    this.joystick.$element.style.position = 'fixed'
    this.joystick.$element.style.bottom = '10px'
    this.joystick.$element.style.left = '10px'
    this.joystick.$element.style.width = '170px'
    this.joystick.$element.style.height = '170px'
    this.joystick.$element.style.borderRadius = '50%'
    this.joystick.$element.style.transition = 'opacity 0.3s 0.0s'
    this.joystick.$element.style.willChange = 'opacity'
    document.body.appendChild(this.joystick.$element)

    this.joystick.$cursor = document.createElement('div')
    this.joystick.$cursor.style.position = 'absolute'
    this.joystick.$cursor.style.top = 'calc(50% - 30px)'
    this.joystick.$cursor.style.left = 'calc(50% - 30px)'
    this.joystick.$cursor.style.width = '60px'
    this.joystick.$cursor.style.height = '60px'
    this.joystick.$cursor.style.border = '2px solid #ffffff'
    this.joystick.$cursor.style.borderRadius = '50%'
    this.joystick.$cursor.style.boxSizing = 'border-box'
    this.joystick.$cursor.style.pointerEvents = 'none'
    this.joystick.$cursor.style.willChange = 'transform'
    this.joystick.$element.appendChild(this.joystick.$cursor)

    this.joystick.$limit = document.createElement('div')
    this.joystick.$limit.style.position = 'absolute'
    this.joystick.$limit.style.top = 'calc(50% - 75px)'
    this.joystick.$limit.style.left = 'calc(50% - 75px)'
    this.joystick.$limit.style.width = '150px'
    this.joystick.$limit.style.height = '150px'
    this.joystick.$limit.style.border = '2px solid #ffffff'
    this.joystick.$limit.style.borderRadius = '50%'
    this.joystick.$limit.style.opacity = '0.25'
    this.joystick.$limit.style.pointerEvents = 'none'
    this.joystick.$limit.style.boxSizing = 'border-box'
    this.joystick.$element.appendChild(this.joystick.$limit)

    Object.keys(config.zones).forEach((zoneId) => {
      const zone = config.zones[zoneId];
      const $zone = document.createElement('div')
      Object.keys(commonZoneCss).forEach((cssKey) => {
        $zone.style[cssKey] = commonZoneCss[cssKey]
      })
      if (zone.icon){
        $zone.style.backgroundImage = `url(${zone.icon})`
      }
      if (zoneId === 'up') {
        $zone.style.backgroundPosition = 'center top'
        $zone.style.justifyContent = 'center'
        $zone.style.alignItems = 'flex-start'
      }
      if (zoneId === 'down') {
        $zone.style.backgroundPosition = 'center bottom'
        $zone.style.justifyContent = 'center'
        $zone.style.alignItems = 'flex-end'
      }
      if (zoneId === 'left') {
        $zone.style.backgroundPosition = 'left center'
        $zone.style.justifyContent = 'flex-start'
        $zone.style.alignItems = 'center'
      }
      if (zoneId === 'right') {
        $zone.style.backgroundPosition = 'right center'
        $zone.style.justifyContent = 'flex-end'
        $zone.style.alignItems = 'center'
      }

      if (zone.label) {
        $zone.innerHTML = zone.label
      }
      this.joystick.$limit.appendChild($zone)
    })

    // Angle
    this.joystick.angle = {}
    // 90 degrees offset
    this.joystick.angle.offset = Math.PI * 0.5

    this.joystick.angle.center = {}
    this.joystick.angle.center.x = 0
    this.joystick.angle.center.y = 0

    this.joystick.angle.current = {}
    this.joystick.angle.current.x = 0
    this.joystick.angle.current.y = 0

    this.joystick.angle.originalValue = 0
    this.joystick.angle.value = - Math.PI * 0.5

    // Resize
    this.joystick.resize = () => {
      const boundings = this.joystick.$element.getBoundingClientRect()

      this.joystick.angle.center.x = boundings.left + boundings.width * 0.5
      this.joystick.angle.center.y = boundings.top + boundings.height * 0.5
    }

    window.addEventListener('resize', this.joystick.resize);
    this.joystick.resize()

    this.updateJoystick()


    // Events
    this.joystick.events = {}
    this.joystick.touchIdentifier = null
    this.joystick.events.touchstart = (_event) => {
      _event.preventDefault()

      const touch = normalizeTouchEvent(_event).changedTouches[0]

      if (touch) {
        this.joystick.active = true;
        this.playerState.setState("ctr-joystick", true);

        this.joystick.touchIdentifier = touch.identifier;

        this.joystick.angle.current.x = touch.clientX;
        this.joystick.angle.current.y = touch.clientY;

        this.joystick.$limit.style.opacity = '0.5'

        document.addEventListener('pointerup', this.joystick.events.touchend)
        document.addEventListener('touchend', this.joystick.events.touchend)
        document.addEventListener('pointermove', this.joystick.events.touchmove, { passive: false })
        document.addEventListener('touchmove', this.joystick.events.touchmove, { passive: false })
        // this.trigger('joystickStart')
      }
    }

    this.joystick.events.touchmove = (_event) => {
      _event.preventDefault()

      const touches = [...normalizeTouchEvent(_event).changedTouches]
      const touch = touches.find((_touch) => _touch.identifier === this.joystick.touchIdentifier)
      if (touch) {
        this.joystick.angle.current.x = touch.clientX
        this.joystick.angle.current.y = touch.clientY
        // this.trigger('joystickMove')
      }
    }

    this.joystick.events.touchend = (_event) => {
      const touches = [...normalizeTouchEvent(_event).changedTouches]
      const touch = touches.find((_touch) => _touch.identifier === this.joystick.touchIdentifier)

      if (touch) {
        this.joystick.active = false;
        this.playerState.setState("ctr-joystick", false);
        // reset zone buttons
        if (this.config.joystick.zones) {
          Object.keys(this.config.joystick.zones).forEach((zone) => {
            this.playerState.setState(`ctr-${this.config.joystick.zones[zone].id}`, false);
          });
        }
        this.joystick.$limit.style.opacity = '0.25'
        this.joystick.$cursor.style.transform = 'translateX(0px) translateY(0px)'
        document.removeEventListener('pointerup', this.joystick.events.touchend)
        document.removeEventListener('touchend', this.joystick.events.touchend)
      }
    }

    this.joystick.$element.addEventListener('pointerdown', this.joystick.events.touchstart, { passive: false })
    this.joystick.$element.addEventListener('touchstart', this.joystick.events.touchstart, { passive: false })
  }

  setupButton({ id, label, css }) {
    let button = {}
    button.id = id;
    button.value = false;

    // Element
    button.$element = document.createElement('div');
    if (label) {
      button.$element.innerHTML = label;
    }
    Object.keys(css.element).forEach((key) => {
      button.$element.style[key] = css.element[key]
    });
    document.body.appendChild(button.$element)

    button.$border = document.createElement('div')
    Object.keys(css.border).forEach((key) => {
      button.$border.style[key] = css.border[key]
    });
    button.$element.appendChild(button.$border)

    // Events
    button.events = {}
    button.touchIdentifier = null
    button.events.touchstart = (_event) => {
      _event.preventDefault()

      const touch = normalizeTouchEvent(_event).changedTouches[0]
      if (touch) {
        button.touchIdentifier = touch.identifier
        button.value = true;
        this.playerState.setState(`ctr-${button.id}`, true);

        button.$border.style.opacity = '0.5'

        document.addEventListener('pointerup', button.events.touchend)
        document.addEventListener('touchend', button.events.touchend)
      }
    }

    button.events.touchend = (_event) => {
      const touches = [...normalizeTouchEvent(_event).changedTouches]
      const touch = touches.find((_touch) => _touch.identifier === button.touchIdentifier)

      if (touch) {
        button.value = false;
        this.playerState.setState(`ctr-${button.id}`, false);

        button.$border.style.opacity = '0.25'

        document.removeEventListener('pointerup', button.events.touchend)
        document.removeEventListener('touchend', button.events.touchend)
      }
    }

    button.$element.addEventListener('pointerdown', button.events.touchstart)
    button.$element.addEventListener('touchstart', button.events.touchstart)
  }

  updateJoystick() {
    // Joystick active
    if (this.joystick.active) {
      // Calculate joystick angle
      this.joystick.angle.originalValue = - Math.atan2(
        this.joystick.angle.current.y - this.joystick.angle.center.y,
        this.joystick.angle.current.x - this.joystick.angle.center.x
      )
      this.joystick.angle.value = this.joystick.angle.originalValue + this.joystick.angle.offset;
      this.playerState.setState("ctr-angle", this.joystick.angle.value);
      if (this.config.joystick?.zones){
        let joystickZone = calculateAngularDirection(this.joystick.angle.originalValue);
        if (this.config.joystick.zones[joystickZone]) {
          this.playerState.setState(`ctr-${this.config.joystick.zones[joystickZone].id}`, true);
        }
        // reset other zones
        Object.keys(this.config.joystick.zones).forEach((zone) => {
          if (zone !== joystickZone) {
            this.playerState.setState(`ctr-${this.config.joystick.zones[zone].id}`, false);
          }
        });
      }

      // Update joystick
      const distance = Math.hypot(this.joystick.angle.current.y - this.joystick.angle.center.y, this.joystick.angle.current.x - this.joystick.angle.center.x)
      let radius = distance
      if (radius > 20) {
        radius = 20 + Math.log(distance - 20) * 5
      }
      if (radius > 43) {
        radius = 43
      }
      const cursorX = Math.sin(this.joystick.angle.originalValue + Math.PI * 0.5) * radius
      const cursorY = Math.cos(this.joystick.angle.originalValue + Math.PI * 0.5) * radius
      this.joystick.$cursor.style.transform = `translateX(${cursorX}px) translateY(${cursorY}px)`
    }

    // Request new frame
    window.requestAnimationFrame(this.updateJoystick.bind(this));
  }
}