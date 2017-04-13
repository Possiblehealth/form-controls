import React, { Component, PropTypes } from 'react';
import ComponentStore from 'src/helpers/componentStore';
import { Validator } from 'src/helpers/Validator';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import Textarea from 'react-textarea-autosize';

export class TextBox extends Component {
  constructor(props) {
    super(props);
    const errors = this._getErrors(props.value) || [];
    const hasErrors = this._isCreateByAddMore() ? this._hasErrors(errors) : false;
    this.state = { hasErrors };
  }

  componentDidMount() {
    if (this.state.hasErrors || this.props.value !== 'undefined') {
      this.props.onChange(this.props.value, this._getErrors(this.props.value));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.validate) {
      const errors = this._getErrors(nextProps.value);
      this.setState({ hasErrors: this._hasErrors(errors) });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.enabled !== nextProps.enabled ||
      this.props.value !== nextProps.value ||
      this.state.hasErrors !== nextState.hasErrors) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    const errors = this._getErrors(this.props.value);
    if (this._hasErrors(errors)) {
      this.props.onChange(this.props.value, errors);
    }
  }

  _hasErrors(errors) {
    return !isEmpty(errors);
  }

  _getErrors(value) {
    const validations = this.props.validations;
    const controlDetails = { validations, value };
    return Validator.getErrors(controlDetails);
  }

  _isCreateByAddMore() {
    return (this.props.formFieldPath.split('-')[1] !== '0');
  }

  handleChange(e) {
    let value = e.target.value;
    value = value && value.trim() !== '' ? value.trim() : undefined;
    const errors = this._getErrors(value);
    this.setState({ hasErrors: this._hasErrors(errors) });
    this.props.onChange(value, errors);
  }

  render() {
    const defaultValue = this.props.value || '';
    return (
        <div className="obs-comment-section-wrap">
      <Textarea
        className={classNames({ 'form-builder-error': this.state.hasErrors })}
        disabled={!this.props.enabled}
        onChange={(e) => this.handleChange(e)}
        value={defaultValue}
      />
        </div>
    );
  }
}

TextBox.propTypes = {
  enabled: PropTypes.bool,
  formFieldPath: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  validate: PropTypes.bool.isRequired,
  validations: PropTypes.array.isRequired,
  value: PropTypes.string,
};

TextBox.defaultProps = {
  enabled: true,
};

ComponentStore.registerComponent('text', TextBox);
