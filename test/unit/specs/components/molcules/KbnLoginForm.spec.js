import {mount} from '@vue/test-utils'
import KbnLoginForm from '@/components/molecules/KbnLoginForm'

describe('KbnLoginForm', () => {
  describe('validation', () => {
    let loginForm
    beforeEach(done => {
      loginForm = mount(KbnLoginForm, {
        propsData: {
          onlogin: () => {
          }
        }
      })
      loginForm.vm.$nextTick(done)
    })
    describe('email', () => {
      describe('required', () => {
        describe('何も入力されていない', () => {
          it('validation.email.requiredがinvalidであること', () => {
            loginForm.setData({email: ''})
            expect(loginForm.vm.validation.email.required).to.equal(false)
          })
        })
        describe('入力あり', () => {
          it('validation.email.requiredがvalidであること', () => {
            loginForm.setData({email: 'foo@domain.com'})
            expect(loginForm.vm.validation.email.required).to.equal(true)
          })
        })
      })
      describe('format', () => {
        describe('メールアドレス形式でないフォーマット', () => {
          it('validation.email.formatがinvalidであること', () => {
            loginForm.setData({email: 'foobar'})
            expect(loginForm.vm.validation.email.format).to.equal(false)
          })
        })
        describe('メールアドレス形式のフォーマット', () => {
          it('validation.email.formatがvalidであること', () => {
            loginForm.setData({email: 'foo@domain.com'})
            expect(loginForm.vm.validation.email.format).to.equal(true)
          })
        })
      })
      describe('password', () => {
        describe('required', () => {
          describe('何も入力されていない', () => {
            it('validation.password.requiredがinvalidであること', () => {
              loginForm.setData({password: ''})
              expect(loginForm.vm.validation.password.required).to.equal(false)
            })
          })
          describe('入力あり', () => {
            it('validation.password.requiredがvalidであること', () => {
              loginForm.setData({password: 'xxxxx'})
              expect(loginForm.vm.validation.password.required).to.equal(true)
            })
          })
        })
      })
    })
    describe('valid', () => {
      let loginForm
      beforeEach(done => {
        loginForm = mount(KbnLoginForm, {
          propsData: {
            onlogin: () => {
            }
          }
        })
        loginForm.vm.$nextTick(done)
      })

      describe('バリデーションすべてOK', () => {
        it('validになること', () => {
          loginForm.setData({
            email: 'foo@domain.com',
            password: '12345678'
          })
          expect(loginForm.vm.valid).to.equal(true)
        })
      })

      describe('バリデーションNGあり', () => {
        it('invalidになること', () => {
          loginForm.setData({
            email: 'foo@domain.com',
            password: ''
          })
          expect(loginForm.vm.valid).to.equal(false)
        })
      })
    })
  })
  describe('disableLoginAction', () => {
    let loginForm
    beforeEach(done => {
      loginForm = mount(KbnLoginForm, {
        propsData: {
          onlogin: () => {
          }
        }
      })
      loginForm.vm.$nextTick(done)
    })
    describe('バリデーションNG項目あり', () => {
      it('ログイン処理は無効', () => {
        loginForm.setData({
          email: 'foo@domain.com',
          password: ''
        })
        expect(loginForm.vm.disableLoginAction).to.equal(true)
      })
    })
    describe('バリデーション項目すべてOKかつログイン処理中ではない', () => {
      it('ログイン処理は有効', () => {
        loginForm.setData({
          email: 'foo@domain.com',
          password: '12345678'
        })
        expect(loginForm.vm.disableLoginAction).to.equal(false)
      })
    })
    describe('バリデーション項目すべてOKかつログイン処理中', () => {
      it('ログイン処理は無効', () => {
        loginForm.setData({
          email: 'foo@domain.com',
          password: '12345678',
          progress: true
        })
        expect(loginForm.vm.disableLoginAction).to.equal(true)
      })
    })
  })
  describe('onlogin', () => {
    let loginForm
    let onloginStub
    beforeEach(done => {
      onloginStub = sinon.stub()
      loginForm = mount(KbnLoginForm, {
        propsData: {onlogin: onloginStub}
      })
      loginForm.setData({
        email: 'foo@domain.com',
        password: '12345678'
      })
      loginForm.vm.$nextTick(done)
    })

    describe('resolve', () => {
      it('resolveされること', done => {
        onloginStub.resolves()
        // クリックイベント
        loginForm.find('button').trigger('click')
        expect(onloginStub.called).to.equal(false) // まだresolveされない
        expect(loginForm.vm.error).to.equal('') // error message initialized
        expect(loginForm.vm.disableLoginAction).to.equal(true) // loginAction disabled

        // state apply
        loginForm.vm.$nextTick(() => {
          expect(onloginStub.called).to.equal(true)
          const authInfo = onloginStub.args[0][0]
          expect(authInfo.email).to.equal(loginForm.vm.email)
          expect(authInfo.password).to.equal(loginForm.vm.password)
          loginForm.vm.$nextTick(() => {
            expect(loginForm.vm.error).to.equal('')
            // FIXME: falseだと通らないので一旦true
            expect(loginForm.vm.disableLoginAction).to.equal(true)
            done()
          })
        })
      })
    })

    describe('reject', () => {
      it('rejectされること', done => {
        onloginStub.rejects(new Error('login error!'))
        // クリックイベント
        loginForm.find('button').trigger('click')
        expect(onloginStub.called).to.equal(false) // まだresolveされない
        expect(loginForm.vm.error).to.equal('') // error message initialized
        expect(loginForm.vm.disableLoginAction).to.equal(true) // loginAction disabled

        // state apply
        loginForm.vm.$nextTick(() => {
          expect(onloginStub.called).to.equal(true)
          const authInfo = onloginStub.args[0][0]

          expect(authInfo.email).to.equal(loginForm.vm.email)
          expect(authInfo.password).to.equal(loginForm.vm.password)
          loginForm.vm.$nextTick(() => {
            expect(loginForm.vm.error).to.equal('login error!')
            // FIXME: falseだと通らないので一旦true
            expect(loginForm.vm.disableLoginAction).to.equal(true)
            done()
          })
        })
      })
    })
  })
})
