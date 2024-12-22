import React from 'react';

/**
 * 下拉单选框
 */
class Select extends React.Component<{
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}> {
  constructor(props: any) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const { onChange } = this.props;
    onChange(event.target.value);
  }

  render() {
    return (
      <div className="space-x-3 py-1">
        <label className="text-gray-500">{this.props.label}</label>
        <select
          value={this.props.value}
          onChange={this.handleChange}
          className="cursor-pointer rounded border p-1"
        >
          {this.props.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export default Select;
