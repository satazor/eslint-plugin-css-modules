import { RuleTester } from 'eslint';

import rule from '../../../lib/rules/no-unused-class';

import { test } from '../../utils';

const ruleTester = new RuleTester();

ruleTester.run('no-unused-class', rule, {
  /*
     valid cases
   */
  valid: [
    /*
       dot notation and square brackets
       eg: s.foo and s['bar']
     */
    test({
      code: `
        import s from './noUnusedClass1.scss';

        export default Foo = () => (
          <div className={s.foo}>
            <div className={s['bar']}>
              <span className={s.bold}></span>
            </div>
          </div>
        );
      `,
    }),
    /*
       ignore global scope selector
     */
    test({
      code: `
        import s from './noUnusedClass2.scss';

        export default Foo = () => (
          <div className={s.foo}>
            <span className="bar"></span>
          </div>
        );
      `,
    }),
    /*
       check if composes classes are ignored
     */
    test({
      code: `
        import s from './composes1.scss';

        export default Foo = () => (
          <div className={s.bar}>
            <span className={s.baz}></span>
          </div>
        );
      `,
    }),
    /*
       composes with multiple classes
     */
    test({
      code: `
        import s from './composesMultiple1.scss';

        export default Foo = () => (
          <div className={s.bar}>
            <span className={s.baz}></span>
          </div>
        );
      `,
    }),
    /*
       check if @extend classes are ignored
     */
    test({
      code: `
        import s from './extend1.scss';

        export default Foo = () => (
          <div className={s.bar}>
            <span className={s.baz}></span>
          </div>
        );
      `,
    }),
    /*
       check if classes are ignored if they only
       exist for nesting parent selectors (`&`)
     */
    test({
      code: `
        import s from './parentSelector7.scss';

        export default Foo = () => (
          <div>
            <span className={s.foo_bar}></span>
            <span className={s.foo_baz}></span>
          </div>
        );
      `,
    }),
  ],
  /*
     invalid cases
   */
  invalid: [
    test({
      code: `
        import s from './noUnusedClass1.scss';

        export default Foo = () => (
          <div className={s.bar}>
          </div>
        );
      `,
      errors: [
        'Unused classes found: foo, bold'
      ]
    }),
    /* ignored global scope selector class */
    test({
      code: `
        import s from './noUnusedClass2.scss';

        export default Foo = () => (
          <div>
          </div>
        );
      `,
      errors: [
        'Unused classes found: foo'
      ]
    }),
    /*
       check less support
     */
    test({
      code: `
        import s from './noUnusedClass1.less';

        export default Foo = () => (
          <div>
          </div>
        );
      `,
      errors: [
        'Unused classes found: foo'
      ]
    }),
    /* check composes support */
    test({
      code: `
        import s from './composes1.scss';

        export default Foo = () => (
          <div className={s.bar}>
          </div>
        );
      `,
      errors: [
        'Unused classes found: baz'
      ]
    }),
    /* check multiple composes support */
    test({
      code: `
        import s from './composesMultiple1.scss';

        export default Foo = () => (
          <div className={s.bar}>
          </div>
        );
      `,
      errors: [
        'Unused classes found: baz'
      ]
    }),
    /* check @extend support */
    test({
      code: `
        import s from './extend1.scss';

        export default Foo = () => (
          <div className={s.bar}>
          </div>
        );
      `,
      errors: [
        'Unused classes found: baz'
      ]
    }),
    /*
       using parent selector (`&`)
     */
    test({
      code: `
        import s from './parentSelector4.scss';

        export default Foo = () => (
          <div className={s.foo}>
            <div className={s.foo_baz}></div>
          </div>
        );
      `,
      errors: [
        'Unused classes found: foo_bar',
      ],
    }),
    test({
      code: `
        import s from './parentSelector8.scss';

        export default Foo = () => (
          <div className={s.foo} />
        );
      `,
      errors: [
        'Unused classes found: foo_bar',
      ],
    }),
  ],
});
