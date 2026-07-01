document.getElementById('year').textContent = new Date().getFullYear();

const SUPABASE_URL = 'https://ixahpgcdrkaazauldawm.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_ObKD1mKW_7c23OSJH0dnHQ_FCuenb8I';

const consultationForm = document.getElementById('consultation-form');
const consultationFormStatus = document.getElementById('consultation-form-status');

const setConsultationFormStatus = (message, type = '') => {
  if (!consultationFormStatus) return;
  consultationFormStatus.textContent = message;
  consultationFormStatus.className = `form-status${type ? ` is-${type}` : ''}`;
};

consultationForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const submitButton = consultationForm.querySelector('button[type="submit"]');
  const formData = new FormData(consultationForm);
  const payload = {
    customer_name: String(formData.get('customer_name') || '').trim(),
    customer_phone: String(formData.get('customer_phone') || '').trim(),
    business_type: String(formData.get('business_type') || '').trim(),
    inquiry_category: String(formData.get('inquiry_category') || '').trim(),
    message: String(formData.get('message') || '').trim(),
    privacy_agreed: formData.get('privacy_agreed') === 'on',
    request_status: 'new',
  };

  if (!payload.privacy_agreed) {
    setConsultationFormStatus('개인정보 수집 및 이용 동의가 필요합니다.', 'error');
    return;
  }

  submitButton.disabled = true;
  setConsultationFormStatus('상담 문의를 접수하는 중입니다.');

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/consultation_requests`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    consultationForm.reset();
    setConsultationFormStatus('상담 문의가 접수되었습니다. 확인 후 연락드리겠습니다.', 'success');
  } catch (error) {
    console.error(error);
    setConsultationFormStatus('접수 중 문제가 발생했습니다. 이메일 문의 버튼을 이용해 주세요.', 'error');
  } finally {
    submitButton.disabled = false;
  }
});

document.querySelectorAll('.accordion-list details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.accordion-list details').forEach((other) => {
      if (other !== item) other.removeAttribute('open');
    });
  });
});

document.querySelectorAll('.email-link').forEach((link) => {
  link.addEventListener('click', (event) => {
    const webmailUrl = link.dataset.webmail;
    if (!webmailUrl) return;

    event.preventDefault();
    let openedExternalApp = false;

    const markOpened = () => {
      openedExternalApp = true;
    };

    window.addEventListener('blur', markOpened, { once: true });
    document.addEventListener('visibilitychange', markOpened, { once: true });

    window.location.href = link.href;

    window.setTimeout(() => {
      if (!openedExternalApp && document.visibilityState === 'visible') {
        window.location.href = webmailUrl;
      }
    }, 900);
  });
});
