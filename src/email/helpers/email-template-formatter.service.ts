export class EmailTemplateFormatter {
  protected applyOverridesToTemplate<T>(
    template: string,
    overrides: T,
  ): string {
    let output = template;

    const matches = output.matchAll(/##[A-Z_]+##/g);

    for (const match of Array.from(matches)) {
      const key = match[0].replace('##', '').replace('##', '');
      output = output.replace(`##${key}##`, overrides[key.toLowerCase()]);
    }

    if (/##[A-Z]+##/g.test(output)) {
      throw new Error('Missing template overrides');
    }

    return output;
  }

  public buildHtmlTemplate<T>(template: string, overrides: T): string {
    return this.applyOverridesToTemplate(template, overrides);
  }
}
