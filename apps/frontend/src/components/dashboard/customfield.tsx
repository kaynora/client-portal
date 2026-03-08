import { Field, FieldProps } from '@kaynora/ui'
import styles from './customfield.module.css'

const CustomField: React.FC<FieldProps> = (props) => {
  return (
    <div className={styles['field-wrapper']}>
      <Field {...props}/>
    </div>
  )
}

export default CustomField
