import _ from "lodash";
import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { createPost } from "../actions";

const FIELDS = {
  title: {
    type: "input",
    label: "Title for Post",
    error: "Please enter a title",
    validate: value => {
      if (value && value.length < 3) {
        return false;
      }
      return true;
    }
  },
  categories: {
    type: "input",
    label: "Categories",
    error: "Please enter a Category"
  },
  content: {
    type: "textarea",
    label: "Post Content",
    error: "Please enter some content"
  }
};

class PostsNew extends Component {
  addField(fieldConfig, field) {
    return (
      <Field
        label={fieldConfig.label}
        name={field}
        key={field}
        component={this.renderField}
      />
    );
  }

  renderField(field) {
    //destructuring of field.meta to access directly touched and error (ES6)
    const { meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? "has-danger " : ""}`;

    return (
      <div className={className}>
        {/*
          //... => take all properties of an object and make them available as
          props
          // field.input => several event handlers such as onChange so it is
          similar to:
            <input
            onChange={field.input.onChange}
            onFocus={field.input.onFocus}
            onBlur={field.input.onBlur}
          />
         */}
        <label>{field.label}</label>
        <input className="form-control" type="text" {...field.input} />
        {/* Automatically added by ReduxForm with validate + tertiary condition with field state pristine /
        touched / invalid */}
        <div className="text-help">{touched ? error : ""}</div>
      </div>
    );
  }

  onSubmit(values) {
    this.props.createPost(values, () => {
      //props/helper wired up by Route Component, that redirect to path in parameters
      this.props.history.push("/");
    });
  }

  //Field compotent role is only to deal with ReduxForm,
  //its component props is used to define how the field show up on the screen
  render() {
    const { handleSubmit } = this.props;

    // handleSubmit is a property wired up to the component throught reduxForm function at the bottom
    //of this file. On form submital, handleSubmit is launched by reduxForm. If everything is OK, then
    //handleSubmit execute the function passed as an argument (callback), in this case our custom function
    //onSubmit. We bind the this (=== this component), to the context of this in the onSubmit function is
    //correct, ie it is the current component
    return (
      <div>
        <h1>Create a new Post</h1>
        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          {_.map(FIELDS, this.addField.bind(this))}
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <Link to="/" className="btn btn-danger">
            Cancel
          </Link>
        </form>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};
  _.each(FIELDS, (field, type) => {
    if (!values[type]) {
      errors[type] = field.error;
    }
    if (field.validate && !field.validate(values[type])) {
      errors[type] = field.error;
    }
  });
  //if errors is empty, form is fine to submit
  return errors;
}

//Allow the component to communicate with the reducers with setup as form/formReducer
//"PostsNewForm" is the namespace of the form, to separate different form states
export default reduxForm({
  validate,
  form: "PostsNewForm"
})(connect(null, { createPost })(PostsNew));
