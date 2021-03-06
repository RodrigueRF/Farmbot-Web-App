import { convertDDItoDeclaration, NOTHING_SELECTED } from "../handle_select";
import { ScopeDeclarationBodyItem, Point, Tool, Coordinate } from "farmbot";
import { NO_VALUE_SELECTED_DDI } from "../location_form_list";

const label = "parent";
const expectedVariable = (data_value: Point | Tool | Coordinate) =>
  ({ kind: "variable_declaration", args: { label, data_value } });

describe("convertDDItoDeclaration()", () => {
  it("returns location data: point", () => {
    const ddi =
      ({ headingId: "GenericPointer", label: "Point 1 (10, 20, 30)", value: 2 });
    const variable = convertDDItoDeclaration({ label })(ddi);
    expect(variable).toEqual(expectedVariable({
      kind: "point",
      args: {
        pointer_id: 2,
        pointer_type: "GenericPointer"
      }
    }));
  });

  it("returns location data: tool", () => {
    const ddi = { headingId: "Tool", label: "Generic Tool", value: 1 };
    const variable = convertDDItoDeclaration({ label })(ddi);
    expect(variable).toEqual(expectedVariable({
      kind: "tool", args: { tool_id: 1 }
    }));
  });

  it("returns location data: Plant", () => {
    const ddi = { headingId: "Plant", label: "Mint", value: 1 };
    const variable = convertDDItoDeclaration({ label })(ddi);
    expect(variable).toEqual(expectedVariable({
      kind: "point", args: { pointer_id: 1, pointer_type: "Plant" }
    }));
  });

  it("returns location data: default", () => {
    const variable = convertDDItoDeclaration({ label })(NO_VALUE_SELECTED_DDI());
    expect(variable).toEqual(expectedVariable(NOTHING_SELECTED));
  });

  it("returns location data: parameter_declaration", () => {
    const ddi = ({ headingId: "parameter", label: "Parent0", value: "parent0" });
    const variable = convertDDItoDeclaration({ label: "parent" })(ddi);
    const expected: ScopeDeclarationBodyItem = {
      kind: "parameter_declaration",
      args: { label: "parent", data_type: "point" }
    };
    expect(variable).toEqual(expected);
  });

  it("returns location data: identifier", () => {
    const ddi = ({ headingId: "parameter", label: "Parent0", value: "parent0" });
    const variable = convertDDItoDeclaration({
      label: "parent", useIdentifier: true
    })(ddi);
    const expected: ScopeDeclarationBodyItem = {
      kind: "variable_declaration",
      args: {
        label: "parent",
        data_value: {
          kind: "identifier", args: { label: "parent0" }
        }
      }
    };
    expect(variable).toEqual(expected);
  });

  it("returns location data: every_point", () => {
    const ddi = ({ headingId: "every_point", label: "All Plants", value: "Plant" });
    const variable = convertDDItoDeclaration({ label: "label" })(ddi);
    const expected: ScopeDeclarationBodyItem = {
      kind: "variable_declaration",
      args: {
        label: "label",
        data_value: {
          kind: "every_point", args: { every_point_type: "Plant" }
        }
      }
    };
    expect(variable).toEqual(expected);
  });
});
