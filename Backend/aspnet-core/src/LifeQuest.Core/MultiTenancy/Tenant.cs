﻿using Abp.MultiTenancy;
using LifeQuest.Authorization.Users;

namespace LifeQuest.MultiTenancy;

public class Tenant : AbpTenant<User>
{
    public Tenant()
    {
    }

    public Tenant(string tenancyName, string name)
        : base(tenancyName, name)
    {
    }
}
