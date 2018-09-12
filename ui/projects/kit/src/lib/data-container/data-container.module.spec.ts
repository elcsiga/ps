import { DataContainerModule } from './data-container.module';

describe('DataContainerModule', () => {
  let dataContainerModule: DataContainerModule;

  beforeEach(() => {
    dataContainerModule = new DataContainerModule();
  });

  it('should create an instance', () => {
    expect(dataContainerModule).toBeTruthy();
  });
});
