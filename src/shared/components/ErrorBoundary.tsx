import React, { Component, ReactNode } from 'react';
import { css } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';
import { Text, Spacing, Button } from '_tosslib/components';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div css={errorContainerStyle}>
          <Text typography="t5" fontWeight="bold" color={colors.grey900}>
            문제가 발생했습니다
          </Text>
          <Spacing size={8} />
          <Text typography="t7" color={colors.grey500}>
            {this.state.error?.message || '알 수 없는 오류가 발생했습니다.'}
          </Text>
          <Spacing size={16} />
          <Button size="small" onClick={this.handleReset}>
            다시 시도
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

const errorContainerStyle = css`
  padding: 40px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;
