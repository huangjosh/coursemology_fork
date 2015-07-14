require 'rails_helper'

RSpec.describe User::EmailsController, type: :controller do
  let!(:instance) { create(:instance) }

  with_tenant(:instance) do
    let!(:user) { create(:administrator) }
    before { sign_in(user) }

    describe '#destroy' do
      subject { delete :destroy, id: user.emails.first }

      context 'when user only have one email' do
        it 'cannot be deleted' do
          expect { subject }.to change { user.emails.count }.by(0)
        end
        it { is_expected.to redirect_to(user_emails_path) }
      end
    end

    describe '#set_primary' do
      let!(:email_stub) do
        stub = create(:user_email, user: user, primary: false)
        allow(stub).to receive(:update_attributes).and_return(false)
        stub
      end
      subject { post :set_primary, id: email_stub }

      context 'when update fails' do
        before do
          controller.instance_variable_set(:@email, email_stub)
        end
        it 'does not change the primary email' do
          subject
          expect(email_stub.reload.primary).to be_falsey
          expect(user.reload.emails.find(&:primary?)).not_to be_nil
        end

        it { is_expected.to redirect_to(user_emails_path) }
      end
    end
  end
end
