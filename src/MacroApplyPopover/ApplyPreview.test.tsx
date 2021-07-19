import React from 'react';
import { render } from "@testing-library/react";
import ApplyPreview from "./ApplyPreview";

it('Renders the preview', () => {
  const doReplacements = () => 'some string';
  const {getByText} = render(
    <ApplyPreview applyMacro={doReplacements} />
  );

  expect(getByText('some string')).not.toBeNull();
});
