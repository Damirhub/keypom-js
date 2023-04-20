import PropTypes from "prop-types";
import React, { Component, createRef } from "react";
import styled from "styled-components";
import LocalAlertBox from "./LocalAlertBox";
import { ACCOUNT_CHECK_TIMEOUT, classNames } from "./utils";

const InputWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  overflow: hidden;
  padding: 4px;
  margin: 5px -4px 30px -4px;

  input {
    margin-top: 0px !important;
  }

  &.wrong-char {
    input {
      animation-duration: 0.4s;
      animation-iteration-count: 1;
      animation-name: border-blink;

      @keyframes border-blink {
        0% {
          box-shadow: 0 0 0 0 rgba(255, 88, 93, 0.8);
        }
        100% {
          box-shadow: 0 0 0 6px rgba(255, 88, 93, 0);
        }
      }
    }
  }

  &.create {
    .input-suffix {
      position: absolute;
      color: #a6a6a6;
      pointer-events: none;
      top: 50%;
      transform: translateY(-50%);
      visibility: hidden;
    }
  }
`;

class AccountFormAccountId extends Component {
  state = {
    accountId: "",
    invalidAccountIdLength: false,
    wrongChar: false,
  };

  checkAccountAvailabilityTimer = null;
  canvas = null;
  suffix = createRef();

  updateSuffix = (userValue) => {
    console.log('userValue: ', userValue)
    if (userValue.match(this.props.pattern)) {
      return;
    }
    const isSafari =
      /Safari/.test(navigator.userAgent) &&
      /Apple Computer/.test(navigator.vendor);
    const width = this.getTextWidth(userValue, "16px Inter");
    console.log('width: ', width)
    const extraSpace = isSafari ? 21.5 : 22;
    console.log('extraSpace: ', extraSpace)
    this.suffix.current.style.left = width + extraSpace + "px";
    this.suffix.current.style.visibility = "visible";
    if (userValue.length === 0) {
      this.suffix.current.style.visibility = "hidden";
    }
  };

  getTextWidth = (text, font) => {
    if (!this.canvas) {
      this.canvas = document.createElement("canvas");
    }
    let context = this.canvas.getContext("2d");
    context.font = font;
    let metrics = context.measureText(text);
    return metrics.width;
  };

  handleChangeAccountId = ({ userValue, el }) => {
    const { pattern, handleChange, type } = this.props;

    const accountId = userValue.toLowerCase();

    if (accountId === this.state.accountId) {
      return;
    }

    if (accountId.match(pattern)) {
      if (this.state.wrongChar) {
        el.style.animation = "none";
        void el.offsetHeight;
        el.style.animation = null;
      } else {
        this.setState(() => ({
          wrongChar: true,
        }));
      }
      return false;
    } else {
      this.setState(() => ({
        wrongChar: false,
      }));
    }

    this.setState(() => ({
      accountId: accountId,
    }));

    handleChange(accountId);

    this.props.localAlert && this.props.clearLocalAlert();

    this.state.invalidAccountIdLength &&
      this.handleAccountIdLengthState(accountId);

    this.checkAccountAvailabilityTimer &&
      clearTimeout(this.checkAccountAvailabilityTimer);
    this.checkAccountAvailabilityTimer = setTimeout(() => {
      this.handleCheckAvailability(accountId, type);
    }, ACCOUNT_CHECK_TIMEOUT);
  };

  checkAccountIdLength = (accountId) => {
    const accountIdWithSuffix = `${accountId}.${this.props.accountIdSuffix}`;
    return accountIdWithSuffix.length >= 2 && accountIdWithSuffix.length <= 64;
  };

  handleAccountIdLengthState = (accountId) =>
    this.setState(() => ({
      invalidAccountIdLength:
        !!accountId && !this.checkAccountIdLength(accountId),
    }));

  handleCheckAvailability = (accountId, type) => {
    if (!accountId) {
      return false;
    }
    if (this.isImplicitAccount(accountId)) {
      return true;
    }
    if (
      !(
        type === "create" &&
        !this.handleAccountIdLengthState(accountId) &&
        !this.checkAccountIdLength(accountId)
      )
    ) {
      return this.props.checkAvailability(
        type === "create" ? this.props.accountId : accountId
      );
    }
    return false;
  };

  isImplicitAccount = (accountId) =>
    this.props.type !== "create" && accountId.length === 64;

  get loaderLocalAlert() {
    return {
      messageCode: `account.create.checkingAvailablity.${this.props.type}`,
    };
  }

  get accountIdLengthLocalAlert() {
    return {
      success: false,
      messageCode: "account.create.errorInvalidAccountIdLength",
    };
  }

  get sameAccountLocalAlert() {
    return {
      success: false,
      show: true,
      messageCode: "account.available.errorSameAccount",
    };
  }

  get implicitAccountLocalAlert() {
    return {
      success: true,
      messageCode: "account.available.implicitAccount",
    };
  }

  get localAlertWithFormValidation() {
    const { accountId, invalidAccountIdLength } = this.state;
    const { mainLoader, localAlert } = this.props;

    if (!accountId) {
      return null;
    }
    if (this.isImplicitAccount(accountId)) {
      return this.implicitAccountLocalAlert;
    }
    if (mainLoader) {
      return this.loaderLocalAlert;
    }
    if (invalidAccountIdLength) {
      return this.accountIdLengthLocalAlert;
    }
    return localAlert;
  }

  render() {
    const { mainLoader, autoFocus, type, disabled } = this.props;
    console.log("props: ", this.props);

    const { accountId, wrongChar } = this.state;

    const localAlert = this.localAlertWithFormValidation;
    const success = localAlert?.success;
    const problem = !localAlert?.success && localAlert?.show;

    return (
      <>
        <InputWrapper
          className={classNames([
            type,
            { success: success },
            { problem: problem },
            { "wrong-char": wrongChar },
          ])}
        >
          <input
            name="accountId"
            data-test-id="createAccount.accountIdInput"
            value={accountId}
            onInput={(e) =>
              type === "create" && this.updateSuffix(e.target.value.trim())
            }
            onChange={(e) =>
              this.handleChangeAccountId({
                userValue: e.target.value.trim(),
                el: e.target,
              })
            }
            placeholder="placeholder"
            required
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            tabIndex="1"
            autoFocus={autoFocus && accountId.length === 0}
            disabled={disabled}
          />
          <span className="input-suffix" ref={this.suffix}>
            .{this.props.accountIdSuffix}
          </span>
          {type !== "create" && (
            <div className="input-sub-label">
              {translate("input.accountId.subLabel")}
            </div>
          )}
        </InputWrapper>
        <LocalAlertBox
          dots={mainLoader}
          localAlert={localAlert}
          accountId={this.props.accountId}
        />
      </>
    );
  }
}

AccountFormAccountId.propTypes = {
  handleChange: PropTypes.func.isRequired,
  checkAvailability: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  autoFocus: PropTypes.bool,
  accountIdSuffix: PropTypes.string.isRequired,
};

AccountFormAccountId.defaultProps = {
  autoFocus: false,
  pattern: /[^a-zA-Z0-9._-]/,
  type: "check",
  accountIdSuffix: "testnet",
};

export default AccountFormAccountId;
