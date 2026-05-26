export const VALID_USER_ID = 'user-123';
export const OTHER_USER_ID = 'other-456';
export const VALID_CONVERSATION_ID = 'conv-789';
export const VALID_PRODUCT_ID = 'product-123';

export const makeSession = (userId = VALID_USER_ID) => ({ userId });

export const buildMessageFormData = (
  content = 'Hello, is this still available?'
): FormData => {
  const formData = new FormData();
  formData.set('content', content);
  return formData;
};

export const makeConversation = () => ({
  id: VALID_CONVERSATION_ID,
  buyerId: VALID_USER_ID,
  sellerId: OTHER_USER_ID,
});

export const makeConversationAsSeller = () => ({
  id: VALID_CONVERSATION_ID,
  buyerId: OTHER_USER_ID,
  sellerId: VALID_USER_ID,
});
