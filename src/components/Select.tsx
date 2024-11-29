import React from 'react';

/**
 * 下拉单选框
 */
class Select extends React.Component<{
  label: string;
  value: string;
  options: { value: string; text: string }[];
  onChange: (value: string) => void;
}> {
  constructor(props: any) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange (event: React.ChangeEvent<HTMLSelectElement>) {
    const { onChange } = this.props
    onChange(event.target.value)
  }

  render () {
    return (
      <div className='py-1 space-x-3'>
        <label className='text-gray-500'>{this.props.label}</label>
        <select value={this.props.value} onChange={this.handleChange} className='border p-1 rounded cursor-pointer'>
          {this.props.options?.map(o => (
            <option key={o.value} value={o.value}>
              {o.text}
            </option>
          ))}
        </select>
      </div>
    )
  }
}

export default Select
