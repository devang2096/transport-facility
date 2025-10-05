import { RegexService } from './regex.service';

describe('RegexService', () => {

  beforeEach(() => {
    const service = new RegexService();
  });

  it('should validate employeeId pattern', () => {
    expect(RegexService.employeeId.test('emp1234')).toBeTrue();
    expect(RegexService.employeeId.test('EMP5678')).toBeTrue();
    expect(RegexService.employeeId.test('1234emp')).toBeFalse();
  });

  it('should validate vehicle number', () => {
    expect(RegexService.vehicleNo.test('KA01AB1234')).toBeTrue();
    expect(RegexService.vehicleNo.test('KA1A1234')).toBeFalse();
  });

  it('should validate address', () => {
    expect(RegexService.address.test('MG Road')).toBeTrue();
    expect(RegexService.address.test('')).toBeFalse();
  });
});
