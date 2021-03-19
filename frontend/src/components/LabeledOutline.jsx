import React from "react";
import ReactDOM from "react-dom";
import InputLabel from "@material-ui/core/InputLabel";
import NotchedOutline from "@material-ui/core/OutlinedInput/NotchedOutline";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {
    position: "relative"
  },
  content: {
    padding: "18.5px 14px",
    borderRadius: "4px"
  },
  inputLabel: {
    position: "absolute",
    left: 0,
    top: 0,
    // slight alteration to spec spacing to match visual spec result
    transform: "translate(0, 24px) scale(1)"
  }
};

const LabelledOutline = ({ classes, id, label, children }) => {
  const [labelWidth, setLabelWidth] = React.useState(0);
  const labelRef = React.useRef(null);
  React.useEffect(() => {
    const labelNode = ReactDOM.findDOMNode(labelRef.current);
    setLabelWidth(labelNode != null ? labelNode.offsetWidth : 0);
  }, [label]);

  return (
    <div className="MuiFormControl-root MuiTextField-root MuiFormControl-marginNormal MuiFormControl-fullWidth">
        <InputLabel
            ref={labelRef}
            htmlFor={id}
            variant="outlined"
            className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-outlined"
            shrink
        >
            {label}
        </InputLabel>
        <div id={id} className={"MuiOutlinedInput-root"}>
          {children}
          <NotchedOutline notched className="MuiOutlinedInput-notchedOutline" labelWidth={labelWidth} />
        </div>
      </div>
  );
};
export default withStyles(styles)(LabelledOutline);