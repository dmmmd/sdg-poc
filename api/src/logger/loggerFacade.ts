const enum LogLevel {
    INFO = 'INFO',
    ERROR = 'ERROR'
}

const buildLoggableMessage = (message: string | object): string => {
    return typeof message === 'string' ? message : JSON.stringify(message);
}

const logWithLevel = (level: LogLevel, message: string | object): void => {
    const loggableMessage = buildLoggableMessage(message);
    console.log(`[${level}] ${loggableMessage}`);
}

export function logInfo(message: string): void;
export function logInfo(message: object): void;
export function logInfo(message: string | object): void {
    logWithLevel(LogLevel.INFO, message);
}

export function logError(message: string): void;
export function logError(message: object): void;
export function logError(message: string | object): void {
    logWithLevel(LogLevel.ERROR, message);
}
