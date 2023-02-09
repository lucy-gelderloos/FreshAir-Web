package com.gelderloos.freshair;

public class SearchLocation {
    private double formInputLatValue;
    private double formInputLonValue;
//    private Long formInputUserIdValue;
    private String formInputUserNameValue;

    public SearchLocation() {
    }

    public double getFormInputLatValue() {
        return formInputLatValue;
    }

    public void setFormInputLatValue(double formInputLatValue) {
        this.formInputLatValue = formInputLatValue;
    }

    public double getFormInputLonValue() {
        return formInputLonValue;
    }

    public void setFormInputLonValue(double formInputLonValue) {
        this.formInputLonValue = formInputLonValue;
    }

//    public Long getFormInputUserIdValue() {
//        return formInputUserIdValue;
//    }
//
//    public void setFormInputUserIdValue(Long formInputUserIdValue) {
//        this.formInputUserIdValue = formInputUserIdValue;
//    }

    public String getFormInputUserNameValue() {
        return formInputUserNameValue;
    }

    public void setFormInputUserNameValue(String formInputUserNameValue) {
        this.formInputUserNameValue = formInputUserNameValue;
    }
}
