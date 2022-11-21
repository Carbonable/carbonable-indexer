{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem(system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
      in
        {
          devShells.default = pkgs.mkShell {
            nativeBuildInputs = with pkgs; [
              protobuf
              nodejs-16_x
              nodePackages.pnpm
              nodePackages.typescript
              nodePackages.typescript-language-server
            ];
          };
        }
    );
}
