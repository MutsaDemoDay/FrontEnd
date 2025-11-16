/* eslint-disable @typescript-eslint/no-explicit-any */
export async function sendEmailVerificationCode(email: string) {
  if (!email) {
    alert('이메일을 입력해주세요.');
    return;
  }
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URI}/v1/auth/email/send`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }
    );
    if (!response.ok) {
      throw new Error('인증번호 전송에 실패했습니다. 다시 시도해주세요.');
    }
    alert('인증번호가 전송되었습니다!');
  } catch (error: any) {
    alert(error.message);
  }
}

export async function verifyEmailCode(email: string, code: string) {
  if (!email || !code) {
    alert('이메일과 인증번호를 모두 확인해주세요.');
    return;
  }
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URI}/v1/auth/email/verify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      }
    );
    if (!response.ok) {
      throw new Error('인증에 실패했습니다. 인증번호를 확인해주세요.');
    }
    alert('이메일 인증이 완료되었습니다!');
  } catch (error: any) {
    alert(error.message);
  }
}
