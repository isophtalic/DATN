package pkg

import "fmt"

type Multiplerror struct {
	errors []error
}

// NewMultiplerror returns a new Multiplerror
func NewMultiplerror() Multiplerror {
	return Multiplerror{}
}

func (m *Multiplerror) Append(err error) {
	m.errors = append(m.errors, err)
}

func (m *Multiplerror) ErrorOrNil() error {
	var errString string
	if len(m.errors) > 0 {
		errString += fmt.Sprintf("%d errors occured.\n", len(m.errors))
		for _, e := range m.errors {
			errString += fmt.Sprintf("\t* %s\n", e)
		}
		return fmt.Errorf("%s", errString)
	}
	return nil
}
