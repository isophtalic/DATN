package utils

import (
	"github.com/sirupsen/logrus"
	"os"
	"time"
)

type LoggerProvider struct {
	logger *logrus.Logger
}

func NewLoggerProvider(logLevel int) *LoggerProvider {
	provider := new(LoggerProvider)
	provider.logger = newLogger()
	provider.SetLogLevel(logLevel)

	return provider
}

func (provider *LoggerProvider) SetLogLevel(logLevel int) {
	level := logrus.InfoLevel
	switch logLevel {
	case 0:
		level = logrus.PanicLevel
	case 1:
		level = logrus.FatalLevel
	case 2:
		level = logrus.ErrorLevel
	case 3:
		level = logrus.WarnLevel
	case 4:
		level = logrus.InfoLevel
	case 5:
		level = logrus.DebugLevel
	default:
		level = logrus.InfoLevel
	}

	provider.logger.Level = level
}

func newLogger() *logrus.Logger {
	logger := logrus.New()

	logger.Level = logrus.InfoLevel
	logger.Formatter = &logrus.TextFormatter{
		DisableTimestamp: false,
		FullTimestamp:    true,
		TimestampFormat:  time.RFC3339Nano,
	}
	logger.Out = os.Stdout

	return logger
}

func (provider *LoggerProvider) Logger() *logrus.Logger {
	return provider.logger
}

func (provider *LoggerProvider) WithFields(fields map[string]interface{}) *logrus.Entry {
	return provider.logger.WithFields(fields)
}

func (provider *LoggerProvider) WithField(key string, val interface{}) *logrus.Entry {
	return provider.logger.WithField(key, val)
}
