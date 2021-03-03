import { Validator, NG_VALIDATORS, AbstractControl } from '@angular/forms';
import { Directive, Input} from '@angular/core';

@Directive({
    selector: '[appRepwValidator]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: RepwValidatorDirective,
        multi: true
    }]
})
export class RepwValidatorDirective implements Validator {
    @Input() appRepwValidator: string;
    validate(control: AbstractControl): { [key: string]: any } | null {
        const compare = control.parent.get(this.appRepwValidator);
        if (compare && compare.value !== control.value) {
            return { notValidRepw: true, require: true };
        }

        return null;
    }
}
