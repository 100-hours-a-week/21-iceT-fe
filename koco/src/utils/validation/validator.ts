export const validateNickname = () => {};

export const validateStatusMessage = () => {};

/** 사용자 이름은 20자 미만이어야 해요. */
// function checkIsNameValid(name: string) {
//     if (name.length === 0) {
//       return {
//         ok: false,
//         reason: "이름은 빈 값일 수 없어요."
//       };
//     }

//     if (name.length >= 20) {
//       return {
//         ok: false,
//         reason: '이름은 20자 이상 입력할 수 없어요.'
//       };
//     }

//     return { ok: true };
//   }

//   /** 사용자 나이는 18세 이상 99세 이하의 자연수여야 해요. */
//   function checkIsAgeValid(age: number) {
//     if (!Number.isInteger(age)) {
//       return {
//         ok: false,
//         reason: "나이는 정수여야 해요."
//       };
//     }

//     if (age < 18) {
//       return {
//         ok: false,
//         reason: "나이는 18세 이상이어야 해요."
//       };
//     }

//     if (age > 99) {
//       return {
//         ok: false,
//         reason: "나이는 99세 이하이어야 해요."
//       };
//     }

//     return { ok: true };
//   }
