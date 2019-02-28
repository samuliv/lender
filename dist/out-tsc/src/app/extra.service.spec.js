import { TestBed } from '@angular/core/testing';
import { ExtraService } from './extra.service';
describe('ExtraService', function () {
    beforeEach(function () { return TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = TestBed.get(ExtraService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=extra.service.spec.js.map