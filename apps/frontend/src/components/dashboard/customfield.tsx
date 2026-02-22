import { Field, FieldProps } from '@kaynora/ui'
import styles from './customfield.module.css'

interface CustomField extends FieldProps {}

const CustomField: React.FC<CustomField> = (props) => {
  return (
    <div className={styles['field-wrapper']}>
      <Field {...props}/>
    </div>
  )
}

export default CustomField
