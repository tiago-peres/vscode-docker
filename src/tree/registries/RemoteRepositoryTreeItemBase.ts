/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RequestPromiseOptions } from "request-promise-native";
import { AzExtParentTreeItem, AzExtTreeItem } from "vscode-azureextensionui";
import { IRepositoryAuthTreeItem } from "../../utils/registryRequestUtils";
import { getThemedIconPath, IconPath } from "../IconPath";
import { getRegistryContextValue, repositorySuffix } from "./registryContextValues";
import { RegistryTreeItemBase } from "./RegistryTreeItemBase";
import { RemoteTagTreeItem } from "./RemoteTagTreeItem";

/**
 * Base class for all repositories
 */
export abstract class RemoteRepositoryTreeItemBase extends AzExtParentTreeItem implements IRepositoryAuthTreeItem {
    public childTypeLabel: string = 'tag';
    public parent: RegistryTreeItemBase;
    public repoName: string;

    public constructor(parent: RegistryTreeItemBase, repoName: string) {
        super(parent);
        this.repoName = repoName;
    }

    public get label(): string {
        return this.repoName;
    }

    public get contextValue(): string {
        return getRegistryContextValue(this, repositorySuffix);
    }

    public get iconPath(): IconPath {
        return getThemedIconPath('repository');
    }

    /**
     * Optional method to implement if repo-level requests should have different authentication than registry-level requests
     * For example, if the registry supports OAuth you might get a token that has just repo-level permissions instead of registry-level permissions
     */
    public addAuth?(options: RequestPromiseOptions): Promise<void>;

    public compareChildrenImpl(ti1: AzExtTreeItem, ti2: AzExtTreeItem): number {
        if (ti1 instanceof RemoteTagTreeItem && ti2 instanceof RemoteTagTreeItem) {
            return ti2.time.valueOf() - ti1.time.valueOf();
        } else {
            return super.compareChildrenImpl(ti1, ti2);
        }
    }
}
