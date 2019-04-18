const repeat = (str, times) => new Array(times + 1).join(str);
const leftPad = (str, maxLength) => str + repeat(" ", maxLength - str.toString().length);
const padZero = (num, maxLength) => repeat("0", maxLength - num.toString().length) + num;
const formatTime = time =>
  `${padZero(time.getHours(), 2)}:${padZero(time.getMinutes(), 2)}:${padZero(
    time.getSeconds(),
    2
  )}.${padZero(time.getMilliseconds(), 3)}`;

const getEffectType = effect => {
  if (!effect || !effect.effect || !effect.effect.type) return "    ";

  return effect.effect.type.toUpperCase();
};
const headerCSS = ["color: cornflowerblue; font-weight: lighter;"];
headerCSS.push("color: gray; font-weight: lighter;");
headerCSS.push("color: inherit;");
headerCSS.push("color: gray; font-weight: lighter;");
const descStyles = `color: #9E9E9E; font-weight: bold`;
const effectStyles = `color: #03A9F4; font-weight: bold`;
const resultStyles = `color: #4CAF50; font-weight: bold`;
const errorStyles = `color: #F20404; font-weight: bold`;

function logDesc(logger, level, effect) {
  let model = { ...effect };

  if (effect.effect) {
    delete model.effect;

    model = {
      ...model,
      ...effect.effect
    };
    if (model.payload) {
      delete model.payload;
    }
  }
  logger[level]("%c desc  ", descStyles, model);
}

function logEffect(logger, level, effect) {
  if (!effect || !effect.effect || !effect.effect.payload) {
    logger[level]("%c effect", effectStyles, effect);
    return;
  }

  logger[level]("%c effect", effectStyles, effect.effect.payload);
}

export default class EffectLogger {
  constructor(config, logger) {
    this.logger = logger;
    this.config = { ...config };
    this.oldStyles = [`color: ${config.color}`, "font-weight: bold"].join(";");
  }

  rootSagaStarted(effect) {
    if (!this.config.rootSagaStart) return;

    if (!this.config.enhancedLogging) {
      this.logger[this.config.level](
        "%c Root saga started:",
        oldStyles,
        effect.saga.name || "anonymous",
        effect.args
      );
    }

    const formattedTime = formatTime(new Date());
    this.logger.group(`%c saga %cSTART %cROOT SAGA %c@ ${formattedTime}`, ...headerCSS);
    logEffect(this.logger, this.config.level, effect);
    this.logger.groupEnd();
  }

  effectTriggered(effect) {
    if (!this.config.effectTrigger) return;

    if (!this.config.enhancedLogging) {
      this.logger[this.config.level]("%c effectTriggered:", oldStyles, effect);
    }

    const formattedTime = formatTime(new Date());
    this.logger.group(
      `%c saga %cTRIGGERED %c${getEffectType(effect)} %c@ ${formattedTime}`,
      ...headerCSS
    );
    logDesc(this.logger, this.config.level, effect);
    logEffect(this.logger, this.config.level, effect);
    this.logger.groupEnd();
  }

  effectResolved(effect, effectId, result) {
    if (!this.config.effectResolve) return;

    if (!this.config.enhancedLogging) {
      this.logger[this.config.level]("%c effectResolved:", oldStyles, effectId, result);
    }

    const formattedTime = formatTime(new Date());
    this.logger.group(
      `%c saga %cRESOLVED  %c${getEffectType(effect)} %c@ ${formattedTime}`,
      ...headerCSS
    );
    logDesc(this.logger, this.config.level, effect);
    logEffect(this.logger, this.config.level, effect);
    this.logger[this.config.level]("%c result", resultStyles, result);
    this.logger.groupEnd();
  }

  effectRejected(effect, effectId, error) {
    if (!this.config.effectReject) return;

    if (!this.config.enhancedLogging) {
      this.logger[this.config.level]("%c effectRejected:", oldStyles, effectId, error);
    }

    const formattedTime = formatTime(new Date());
    this.logger.group(
      `%c saga %cREJECTED  %c${getEffectType(effect)} %c@ ${formattedTime}`,
      ...headerCSS
    );
    logDesc(this.logger, this.config.level, effect);
    logEffect(this.logger, this.config.level, effect);
    this.logger[this.config.this.config.level]("%c error", errorStyles, error);
    this.logger.groupEnd();
  }

  effectCancelled(effect, effectId) {
    if (!this.config.effectCancel) return;

    if (!this.config.enhancedLogging) {
      this.logger[this.config.level]("%c effectCancelled:", oldStyles, effectId);
    }

    const formattedTime = formatTime(new Date());
    this.logger.group(
      `%c saga %cCANCELLED %c${getEffectType(effect)} %c@ ${formattedTime}`,
      ...headerCSS
    );
    logDesc(this.logger, this.config.level, effect);
    logEffect(this.logger, this.config.level, effect);
    this.logger.groupEnd();
  }

  actionDispatched(action) {
    if (!this.config.actionDispatch) return;

    if (!this.config.enhancedLogging) {
      this.logger[this.config.level]("%c actionDispatched:", oldStyles, action);
    }

    const formattedTime = formatTime(new Date());
    this.logger.group(`%c saga %cACTION %cDISPATCHED %c@ ${formattedTime}`, headerCSS);
    this.logger[this.config.level]("%c action", effectStyles, action);
    this.logger.groupEnd();
  }
}
