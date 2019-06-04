import styled, { CreateStyled } from '@emotion/styled';

type Theme = {
  rootSize: number;
  color: {
    primary: string;
    secondary: string;
  };
  textColor: string;
  fontFamily: {
    monospace: string;
  };
  body: {
    color: string;
    bg: string;
  };

  divider: {
    color: string;
  };
  borderRadius: string;
};

export default styled as CreateStyled<Theme>;
